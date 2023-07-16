import "../css/form.css";

export default class FormController {
  constructor() {
    const form = document.createElement("form");
    form.classList.add("form-widget");
    form.classList.add("item");
    form.innerHTML = `<div class="form-header">
    <span class="form-title"></span>
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
    this.formTitle = this._form.querySelector(".form-title");
    this.shortInput = this._form.querySelector(".short-input");
    this.fullInput = this._form.querySelector(".full-input");
    this.cancelBtn = this._form.querySelector(".cancel-btn");
    this.acceptBtn = this._form.querySelector(".accept-btn");
  }

  get createForm() {
    this.formTitle.textContent = "Добавить тикет";
    return {
      form: this._form,
      cancelBtn: this.cancelBtn,
      acceptBtn: this.acceptBtn,
    };
  }

  getEditForm(data) {
    const { name, description } = data;
    this.formTitle.textContent = "Изменить тикет";
    this.shortInput.value = name;
    this.fullInput.value = description;
    return { form: this._form, cancelBtn: this.cancelBtn };
  }

  /*get data() {
    const data = this.inputText.value;
    if (data === "") {
      return null;
    }
    this._form.reset();
    return data;
  }*/
}
