const date = new Date();
let actualMonth = date.getMonth();
let actualYear = date.getFullYear();
let today = date.getDay();
let counter = 0;
let calendarStart = 0;
let choosenDayId = null;

const forwardToggle = document.querySelector("#forward");
const backwardToggle = document.querySelector("#backward");
const backToToday = document.querySelector("#today-button");
const addEventButton = document.querySelector(".side-menu__btn");
const planField = document.querySelector(".side-menu__plan-inner");
const eventsList = document.querySelector(".side-menu__plan-inner");
const updateForm = document.querySelector(".update-event-form");
const backBtn = document.querySelector(".side-menu__btn-back");
const addForm = document.querySelector(".add-event-form");

const daysInMonth = () => {
  return new Date(actualYear, actualMonth, 0).getDate();
};

const updateCalendar = (days) => {
  let firstDay = new Date(actualYear, actualMonth, 1).getDay();
  const calendarDays = document.querySelectorAll(".calendar__day");
  const calendar = document.querySelector(".calendar__table");
  const calendarDaysArray = Array.from(calendarDays);

  if (calendarStart === 0) {
    choosenDayId = [
      (date.getDate() - 1).toString(),
      date.getMonth().toString(),
      date.getFullYear().toString(),
    ];
    getEventsFromDb();
  }

  calendarDaysArray.forEach((item) => {
    item.remove();
  });

  if (firstDay === 0) {
    for (let i = 0; i < 6; i++) {
      const div = document.createElement("div");
      div.className = "calendar__day";
      calendar.appendChild(div);
    }
  } else {
    for (let i = 0; i < firstDay - 1; i++) {
      const div = document.createElement("div");
      div.className = "calendar__day .inactive";
      calendar.appendChild(div);
    }
  }

  for (let i = 0; i < days; i++) {
    const div = document.createElement("div");
    const span = document.createElement("span");

    span.className = "calendar__day-span";
    div.className = "calendar__day";
    div.tabIndex = "0";
    div.id = `${i}.${actualMonth}.${actualYear}`;
    span.innerText = i + 1;

    div.appendChild(span);
    calendar.appendChild(div);
  }

  fillDaysWithEvents();
  markChoosenDay();
  calendarStart++;
};

const fillDaysWithEvents = async () => {
  const calendarDays = document.querySelectorAll(".calendar__day");
  try {
    const response = await fetch("http://localhost:3000/events");
    const resData = await response.json();

    resData.forEach((item) => {
      const pEvent = document.createElement("p");
      pEvent.draggable = "true";
      pEvent.className = "calendar__day-event";
      pEvent.innerText = `${item.name}`;
      pEvent.id = item.id;
      calendarDays.forEach((day) => {
        if (
          JSON.stringify(item.date.split(".")) ===
          JSON.stringify(day.id.split("."))
        ) {
          day.appendChild(pEvent);
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
  loadEvents();
};

const markChoosenDay = () => {
  const newCalendarDays = document.querySelectorAll(".calendar__day");
  newCalendarDays.forEach((day) => {
    day.classList.remove("choosen");
  });

  newCalendarDays.forEach((day) => {
    const dayId = day.id.split(".");
    if (JSON.stringify(dayId) === JSON.stringify(choosenDayId)) {
      day.classList.add("choosen");
    }
  });
  updateDayInPlan();
};

const updateMonth = (current) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = document.querySelector(".month-year h2");
  currentMonth.innerText = `${monthNames[current]} ${actualYear}`;
};

const gettingBackToToday = () => {
  actualMonth = date.getMonth();
  actualYear = date.getFullYear();
  counter = 0;

  updateCalendar(daysInMonth(0));
  updateMonth(actualMonth);
};

const updateDayInPlan = () => {
  const planDay = document.querySelector(".side-menu__choosen-day");
  const day = parseInt(choosenDayId[0]);
  const month = parseInt(choosenDayId[1]);
  const year = parseInt(choosenDayId[2]);

  if (day + 1 < 10 && month + 1 < 10) {
    planDay.innerText = `0${day + 1}.0${month + 1}.${year}`;
  } else if (day + 1 < 10) {
    planDay.innerText = `0${day + 1}.${month + 1}.${year}`;
  } else if (month + 1 < 10) {
    planDay.innerText = `${day + 1}.0${month + 1}.${year}`;
  } else {
    planDay.innerText = `${day + 1}.${month + 1}.${year}`;
  }
};

const chooseDay = (id) => {
  choosenDayId = id.split(".");
  markChoosenDay();
};

const cleanPlan = () => {
  planField.innerHTML = "";
};

const fillPlan = (item) => {
  const li = document.createElement("li");
  const button = document.createElement("button");

  button.className = "side-menu__plan-btn";
  button.innerText = item.name;
  button.id = item.id;

  li.className = "side-menu__event";
  li.appendChild(button);
  planField.appendChild(li);
  button.addEventListener("click", (e) => {
    editEventState(e.target);
  });
};

const editEventState = (item) => {
  backBtn.style.display = "block";
  eventsList.style.display = "none";
  addEventButton.style.display = "none";
  updateForm.style.display = "flex";

  backBtn.addEventListener("click", clearEditEventState);

  updateForm.addEventListener("click", (e) => {
    e.preventDefault();
    updateEvent(e, item.id);
  });

  const titleField = document.querySelector(".update-form__title");
  const localField = document.querySelector(".update-form__localization");
  const timeField = document.querySelector(".update-form__time");

  fetch(`http://localhost:3000/events/${item.id}`)
    .then(res => res.json())
    .then(data => {
      console.log(data.hour);
      titleField.value = data.name;
      localField.value = data.localization;
      timeField.value = data.hour;
    });
};

const clearEditEventState = () => {
  backBtn.style.display = "none";
  eventsList.style.display = "block";
  addEventButton.style.display = "block";
  updateForm.style.display = "none";
};

const updateEvent = (e, id) => {
  const title = document.querySelector(".update-form__title").value;
  const local = document.querySelector(".update-form__localization").value;
  const time = document.querySelector(".update-form__time").value;

  if (e.target.value === "Edit") {
    fetch(`http://localhost:3000/events/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: `${title}`,
        localization: `${local}`,
        time: `${time}`,
      }),
    });
  } else if (e.target.value === "Delete") {
    fetch(`http://localhost:3000/events/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
  }
};

const getEventsFromDb = async () => {
  cleanPlan();
  try {
    const response = await fetch("http://localhost:3000/events");
    const resData = await response.json();

    resData.forEach((item) => {
      if (
        JSON.stringify(item.date.split(".")) === JSON.stringify(choosenDayId)
      ) {
        fillPlan(item);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const addEventToDb = async data => {
  const response = await fetch("http://localhost:3000/events", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  return resData;
};

const moveEventToAnotherDay = async item => {
  const response = await fetch(`http://localhost:3000/events/${item.id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      date: `${item.parentElement.id}`,
    }),
  });

  const resData = await response.json();
  return resData;
};

const addEventState = () => {
  backBtn.style.display = "block";
  addEventButton.style.display = "none";
  eventsList.style.display = "none";
  addForm.style.display = "flex";

  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const eventName = document.querySelector("#title").value;
    const eventLoc = document.querySelector("#localization").value;
    const eventTime = document.querySelector("#time").value;

    if (eventName === "" || eventLoc === "" || eventTime === "") {
      const div = document.createElement("div");
      const p = document.createElement("p");
      div.className = "alert";

      p.innerText = "Fill in all fields";
      div.appendChild(p);
      addForm.appendChild(div)

      setTimeout(() => {
        div.remove();
      }, 3000);
    } else {
      const data = {
        date: choosenDayId.join(["."]),
        name: eventName,
        hour: eventTime,
        localization: eventLoc,
      };
      addEventToDb(data);
      fillPlan(data);
      addEventToDay(data);
      clearAddEventState();
    }
  });

  backBtn.addEventListener("click", (e) => {
    clearAddEventState();
  });
};

const addEventToDay = (data) => {
  const calendarDays = document.querySelectorAll(".calendar__day");
  const pEvent = document.createElement("p");
  pEvent.draggable = "true";
  pEvent.className = "calendar__day-event";
  pEvent.innerText = `${data.name}`;
  pEvent.id = data.id;

  calendarDays.forEach((day) => {
    if (
      JSON.stringify(day.id.split(".")) === JSON.stringify(data.date.split("."))
    ) {
      day.appendChild(pEvent);
    }
  });
};

const cleanSideMenu = () => {
  if (addForm.style.display === "flex") {
    clearAddEventState();
  } else if (updateForm.style.display === "flex") {
    clearEditEventState();
  }
};

const clearAddEventState = () => {
  backBtn.style.display = "none";
  addEventButton.style.display = "block";
  eventsList.style.display = "block";
  addForm.style.display = "none";
};

const loadEvents = () => {
  const draggableEvents = document.querySelectorAll(".calendar__day-event");
  const daysContainers = document.querySelectorAll(".calendar__day");

  daysContainers.forEach((container) => {
    container.addEventListener("click", () => {
      cleanSideMenu();
      chooseDay(container.id);
      getEventsFromDb();
    });
  });

  draggableEvents.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", (e) => {
      chooseDay(e.target.parentElement.id);
      draggable.classList.remove("dragging");
      moveEventToAnotherDay(e.target);
    });
  });

  daysContainers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector(".dragging");

      if (afterElement == null) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    });
  });

  const getDragAfterElement = (container, y) => {
    const draggableElements = [
      ...container.querySelectorAll(".calendar__day-event:not(.dragging)"),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };
};

(function () {
  updateCalendar(daysInMonth(0));
  updateMonth(actualMonth);

  addEventButton.addEventListener("click", () => {
    addEventState();
  });

  backToToday.addEventListener("click", () => {
    gettingBackToToday();
  });

  forwardToggle.addEventListener("click", () => {
    counter++;
    actualMonth++;
    if (actualMonth >= 12) {
      actualMonth = 0;
      actualYear++;
    }
    updateCalendar(daysInMonth(counter));
    updateMonth(actualMonth);
  });

  backwardToggle.addEventListener("click", () => {
    counter--;
    actualMonth--;
    if (actualMonth < 0) {
      actualMonth = 11;
      actualYear--;
    }
    updateCalendar(daysInMonth(counter));
    updateMonth(actualMonth);
  });
})();
