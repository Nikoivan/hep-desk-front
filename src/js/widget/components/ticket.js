import "../css/ticket.css";

export default class Ticket {
  constructor(data) {
    const { id, name, status, created } = data;

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
      remove: this.element.querySelector(".ticket-remove"),
    };
  }

  get data() {
    return { name: this.name, description: this.description, id: this.id };
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
    const { name } = data;
    this.name = name;
    this.ticketTitle.textContent = name;
  }

  remove() {
    this._element.remove();
  }
}
