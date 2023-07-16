import "../css/confirm.css";

export default class ConfirmController {
  constructor() {
    const confirmEl = document.createElement("div");
    confirmEl.classList.add("confirm-window");
    confirmEl.innerHTML = `<div class="confirm-header"><span class="confirm-title">Удалить тикет</span></div>
    <div class="confirm-main"><p class="confirm-text">Вы уверены, что хотите удалить тикет? Это действие необратимо.</p></div>       
    <div class="confirm-footer">
        <span class="confirm-cancel-btn">Отмена</span>
        <span class="confirm-accept-btn">Ок</span>
    </div>`;

    this.element = confirmEl;
  }

  getConfObj() {
    return {
      element: this.element,
      cancel: this.element.querySelector(".confirm-cancel-btn"),
      accept: this.element.querySelector(".confirm-accept-btn"),
    };
  }

  get window() {
    return this.element;
  }
}
