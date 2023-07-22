/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/widget/ticketwidget.js

class TicketWidget {
  constructor(settings) {
    const {
      parentName,
      Form,
      Popup,
      Confirm,
      Ticket
    } = settings;
    const parentEl = document.querySelector(`.${parentName}`);
    this.formControl = new Form();
    this.popupControl = new Popup(this.ticketList);
    this.confirmControl = new Confirm();
    this.ItemType = Ticket;
    this.tickets = [];
    this.bindToDOM(parentEl);
  }
  bindToDOM(parentEl) {
    const widget = this.getHTML();
    parentEl.append(widget);
    this.element = widget;
    this.ticketList = this.element.querySelector(".ticket-list");
    this.btnAddTicket = this.element.querySelector(".add-ticket");
    this.onBtnAddTicket = this.onBtnAddTicket.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.btnAddTicket.addEventListener("click", this.onBtnAddTicket);
    document.addEventListener("DOMContentLoaded", () => this.sendRequest({
      type: "GET",
      method: "allTickets"
    }));
  }
  getHTML() {
    const widget = document.createElement("div");
    widget.classList.add("ticket-widget");
    widget.innerHTML = `<div class="tw-header">
    <div class="tw-btn">
        <span class="add-ticket">
            Добавить тикет
        </span>
    </div>
</div>
<div class="tw-main">
    <ul class="ticket-list">        
    </ul>
</div>`;
    return widget;
  }
  async editBind(data) {
    const response = await fetch(`http://localhost:7070/?method=ticketById&id=${data.id}`);
    const json = await response.json();
    const {
      form,
      cancelBtn,
      acceptBtn
    } = this.formControl.getEditForm(json.name, json.description);
    form.addEventListener("submit", e => {
      this.sendRequest({
        type: "PUT",
        method: "updateById",
        id: data.id
      }, form, e);
    });
    this.popupControl.showPopup(form, this.element);
    cancelBtn.addEventListener("click", e => {
      if (e.target !== acceptBtn) {
        this.popupControl.removePopup(form, e);
      }
    });
  }
  async bindTicket(ticket) {
    const ticketElement = ticket.element;
    const data = ticket.data;
    const {
      status,
      edit,
      remove
    } = ticket.btns;
    ticketElement.addEventListener("click", e => {
      if (e.target === edit) {
        this.editBind(data);
      } else if (e.target === remove) {
        const {
          element,
          cancel,
          accept
        } = this.confirmControl.getConfObj();
        this.popupControl.showPopup(element, ticketElement);
        cancel.addEventListener("click", e => this.popupControl.removePopup(element, e));
        accept.addEventListener("click", () => {
          this.sendRequest({
            type: "DELETE",
            method: "deleteById",
            id: ticket.getId()
          }, element, e);
        });
      } else if (e.target === status) {
        this.sendRequest({
          type: "PUT",
          method: "updateById",
          id: data.id,
          status: {
            key: "status",
            value: "done"
          }
        });
      } else {
        this.sendRequest({
          type: "GET",
          method: "ticketById",
          id: data.id
        });
      }
    });
  }
  addTickets(arr) {
    this.tickets.forEach(el => el.remove());
    this.tickets = [];
    arr.forEach(el => {
      const ticket = new this.ItemType(el);
      this.bindTicket(ticket);
      this.ticketList.append(ticket.element);
      this.tickets.push(ticket);
    });
  }
  async sendRequest(data, form, e) {
    if (e) {
      e.preventDefault();
    }
    const url = "http://localhost:7070/?method=";
    const {
      type,
      method,
      id,
      status
    } = data;
    let response;
    try {
      let fullUrl = url + method;
      if (id) {
        fullUrl += `&id=${id}`;
      }
      if (type === "GET" || type === "DELETE") {
        if (type === "GET") {
          response = await fetch(fullUrl);
        } else {
          response = await fetch(fullUrl, {
            method: type,
            mode: "cors",
            headers: new Headers()
          });
        }
      } else if (type === "POST" || type === "PUT") {
        let formData;
        if (form) {
          formData = new FormData(form);
        } else {
          formData = new FormData();
          formData.append(status.key, status.value);
        }
        response = await fetch(fullUrl, {
          method: type,
          mode: "cors",
          body: formData,
          headers: new Headers()
        });
      }
      const json = await response.json();
      if (json.err) {
        console.log(json.err);
        //добавить вывод о том, что есть ошибка
        return;
      }
      this.responseHandler(json);
    } catch (e) {
      console.log(e);
    }
    if (form) {
      this.popupControl.removePopup(form);
    }
  }
  responseHandler(data) {
    if (Array.isArray(data)) {
      this.addTickets(data);
      return;
    } else {
      const {
        type,
        ticket,
        description,
        status,
        id
      } = data;
      if (type === "create") {
        this.createTicket(ticket);
      } else if (type === "description") {
        this.addDescription(description, id);
      } else if (type === "status") {
        this.changeStatus(status, id);
      } else if (type === "deleted") {
        this.removeTicket(id);
      } else if (type === "update") {
        this.updateTicket(id, ticket);
      }
      //закончил тут
    }
  }

  addDescription(description, id) {
    const ticket = this.tickets.find(el => el.getId() === id);
    ticket.showDescription(description);
  }
  changeStatus(status, id) {
    const ticket = this.tickets.find(el => el.getId() === id);
    ticket.changeStatus(status);
  }
  createTicket(data) {
    const ticket = new this.ItemType(data);
    this.bindTicket(ticket);
    this.ticketList.append(ticket.element);
    this.tickets.push(ticket);
  }
  removeTicket(id) {
    const ticket = this.tickets.find(el => el.id === id);
    ticket.element.remove();
    this.tickets = this.tickets.filter(el => el.id !== id);
  }
  updateTicket(id, data) {
    const ticket = this.tickets.find(el => el.getId() === id);
    ticket.update(data);
  }
  onBtnAddTicket() {
    const {
      form,
      cancelBtn
    } = this.formControl.createForm;
    form.addEventListener("submit", e => {
      this.sendRequest({
        type: "POST",
        method: "createTicket"
      }, form, e);
    });
    this.popupControl.showPopup(form, this.element);
    cancelBtn.addEventListener("click", e => this.popupControl.removePopup(form, e));
  }
}
;// CONCATENATED MODULE: ./src/js/widget/components/form.js

class FormController {
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
      acceptBtn
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
    return {
      form,
      cancelBtn
    };
  }
}
;// CONCATENATED MODULE: ./src/js/widget/components/popup.js

class PopupController {
  constructor(onElement) {
    this.inElement = document.body;
    this.onElement = onElement;
    this.actualPopups = [];
    this.removePopup = this.removePopup.bind(this);
  }
  showPopup(element, onElement) {
    const {
      top,
      left
    } = onElement.getBoundingClientRect();
    element.classList.add("popup");
    document.body.append(element);
    element.style.top = `${top - 30 + onElement.offsetHeight / 2 - element.offsetHeight / 2}px`;
    element.style.left = `${left - 30 + onElement.offsetWidth / 2 - element.offsetWidth / 2}px`;
  }
  removePopup(element, e) {
    if (e) {
      e.preventDefault();
    }
    element.remove();
  }
}
;// CONCATENATED MODULE: ./src/js/widget/components/confirm.js

class ConfirmController {
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
      accept
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
;// CONCATENATED MODULE: ./src/js/widget/components/ticket.js

class Ticket {
  constructor(data) {
    const {
      id,
      name,
      status,
      created
    } = data;
    let checkStatus;
    if (status === "done") {
      checkStatus = "&#x2714";
    } else {
      checkStatus = "";
    }
    const ticket = document.createElement("div");
    ticket.classList.add("ticket");
    ticket.innerHTML = `<div class="ticket-wrapper"><span class="ticket-check">${checkStatus}</span>
    <div><span class="ticket-title">${name}</span></div>
    <span class="ticket-time">${created}</span>
    <div class="ticket-tools">
        <span class="ticket-edit btn">&#x270E;</span>
        <span class="ticket-remove btn">&#x2716;</span>
    </div></div>`;
    this.id = id;
    this.name = name;
    this.status = status;
    this.created = created;
    this._element = ticket;
    this.ticketStatus = this._element.querySelector(".ticket-check");
    this.ticketTitle = this._element.querySelector(".ticket-title");
  }
  get element() {
    return this._element;
  }
  get btns() {
    return {
      status: this.element.querySelector(".ticket-check"),
      edit: this.element.querySelector(".ticket-edit"),
      remove: this.element.querySelector(".ticket-remove")
    };
  }
  get data() {
    return {
      name: this.name,
      description: this.description,
      id: this.id
    };
  }
  getId() {
    return this.id;
  }
  changeStatus(status) {
    if (this.status === "done") return;
    this.status = status;
    this.ticketStatus.innerHTML = "&#x2714";
  }
  showDescription(description) {
    if (this.description) {
      this.description.remove();
      this.description = null;
      return;
    }
    const par = document.createElement("p");
    par.classList.add("description");
    par.textContent = description;
    this.description = par;
    this._element.append(par);
  }
  update(data) {
    const {
      name
    } = data;
    this.name = name;
    this.ticketTitle.textContent = name;
  }
  remove() {
    this._element.remove();
  }
}
;// CONCATENATED MODULE: ./src/js/app.js





const settings = {
  parentName: "wrapper",
  Form: FormController,
  Popup: PopupController,
  Confirm: ConfirmController,
  Ticket: Ticket
};
const ticketWidget = new TicketWidget(settings);
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;