class UICtrl {
    constructor() {
        this.forwardToggle = document.querySelector("#forward");
        this.backwardToggle = document.querySelector("#backward");
        this.backToToday = document.querySelector("#today-button");
        this.addEventButton = document.querySelector(".side-menu__btn");
        this.planField = document.querySelector(".side-menu__plan-inner");
        this.eventsList = document.querySelector(".side-menu__plan-inner");
        this.updateForm = document.querySelector(".update-event-form");
        this.backBtn = document.querySelector(".side-menu__btn-back");
        this.addForm = document.querySelector(".add-event-form");
    }
}

export default UICtrl;