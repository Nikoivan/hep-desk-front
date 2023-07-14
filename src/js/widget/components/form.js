import "../css/form.css";

export default class FormController {
  constructor() {
    const form = document.createElement("form");
    form.classList.add("form-widget");
    form.classList.add("item");
    form.innerHTML = `<div class="form-header">
    <span class="form-title">Добавить тикет</span>
</div>
<div class="form-main">
    <div class="short-info">
        <label for="short-input" class="short-label">Краткое описание</label>
        <input type="text" name="name" class="short-input" required>
    </div>
    <div class="full-info">
        <label for="full-input" class="full-label">Подробное описание</label>
        <textarea class="full-input" name="description" cols="30" rows="10" required></textarea>
    </div>
</div>
<div class="form-footer">
    <button class="cancel-btn">Отмена</button>
    <button class="accept-btn">Ок</button>
</div>`;

    this._form = form;
    this.cancelBtn = this._form.querySelector(".cancel-btn");
  }

  get form() {
    return this._form;
  }

  /*get data() {
    const data = this.inputText.value;
    if (data === "") {
      return null;
    }
    this._form.reset();
    return data;
  }*/

  get cancel() {
    return this.cancelBtn;
  }
}
