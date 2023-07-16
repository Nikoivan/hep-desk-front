import "../css/ticket.css";

export default class Ticket {
  constructor(data) {
    const { id, name, status, description, created } = data;

    const ticket = document.createElement("div");
    ticket.classList.add("ticket");
    ticket.innerHTML = `<span class="ticket-check">&#x2714;</span>
    <span class="ticket-title">${name}</span>
    <span class="ticket-time">${created}</span>
    <div class="ticket-tools">
        <span class="ticket-edit btn">&#x270E;</span>
        <span class="ticket-remove btn">&#x2716;</span>
    </div>`;

    this.id = id;
    this.name = name;
    this.status = status;
    this.description = description;
    this.created = created;

    this._element = ticket;
  }

  get element() {
    return this._element;
  }

  get btns() {
    return {
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

  remove() {
    this._element.remove();
  }
}
