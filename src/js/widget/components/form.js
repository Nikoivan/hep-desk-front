import "../css/form.css";

export default class FormController {
  constructor() {}

  get createForm() {
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

    const cancelBtn = form.querySelector(".cancel-btn");
    const acceptBtn = form.querySelector(".accept-btn");

    return {
      form,
      cancelBtn,
      acceptBtn,
    };
  }

  getEditForm(name, description) {
    const form = document.createElement("form");
    form.classList.add("form-widget");
    form.classList.add("item");
    form.innerHTML = `<div class="form-header">
    <span class="form-title">Изменить тикет</span>
</div>
<div class="form-main">
    <div class="short-info">
        <label for="short-input" class="short-label">Краткое описание</label>
        <input type="text" name="name" class="short-input" required value="${name}">
    </div>
    <div class="full-info">
        <label for="full-input" class="full-label">Подробное описание</label>
        <textarea class="full-input" name="description" cols="30" rows="10" required>${description}</textarea>
    </div>
</div>
<div class="form-footer">
    <button class="cancel-btn">Отмена</button>
    <button class="accept-btn">Ок</button>
</div>`;

    const cancelBtn = form.querySelector(".cancel-btn");
    return { form, cancelBtn };
  }
}
