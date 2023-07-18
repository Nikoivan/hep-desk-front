import "../css/confirm.css";

export default class ConfirmController {
  constructor() {}

  getConfObj() {
    const element = document.createElement("div");
    element.classList.add("confirm-window");
    element.innerHTML = `<div class="confirm-header"><span class="confirm-title">Удалить тикет</span></div>
    <div class="confirm-main"><p class="confirm-text">Вы уверены, что хотите удалить тикет? Это действие необратимо.</p></div>       
    <div class="confirm-footer">
        <span class="confirm-cancel-btn">Отмена</span>
        <span class="confirm-accept-btn">Ок</span>
    </div>`;

    const cancel = element.querySelector(".confirm-cancel-btn");
    const accept = element.querySelector(".confirm-accept-btn");

    return {
      element,
      cancel,
      accept,
    };
  }

  get window() {
    const element = document.createElement("div");
    element.classList.add("confirm-window");
    element.innerHTML = `<div class="confirm-header"><span class="confirm-title">Удалить тикет</span></div>
    <div class="confirm-main"><p class="confirm-text">Вы уверены, что хотите удалить тикет? Это действие необратимо.</p></div>       
    <div class="confirm-footer">
        <span class="confirm-cancel-btn">Отмена</span>
        <span class="confirm-accept-btn">Ок</span>
    </div>`;
    return element;
  }
}
