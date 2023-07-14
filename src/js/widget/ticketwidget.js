import "./css/ticketwidget.css";

export default class TicketWidget {
  constructor(settings) {
    const { parentName, Form, Popup, Confirm, Ticket } = settings;
    const parentEl = document.querySelector(`.${parentName}`);
    this.formControl = new Form();

    this.confirmControl = new Confirm();
    this.ItemType = Ticket;
    this.tickets = [];

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

    parentEl.append(widget);

    this.element = widget;
    this.ticketList = this.element.querySelector(".ticket-list");
    this.btnAddTicket = this.element.querySelector(".add-ticket");
    this.popupControl = new Popup(this.ticketList);

    this.onBtnAddTicket = this.onBtnAddTicket.bind(this);
    this.sendCreateTicket = this.sendCreateTicket.bind(this);

    this.btnAddTicket.addEventListener("click", this.onBtnAddTicket);
    document.addEventListener("DOMContentLoaded", this.loadTickets);
  }

  async loadTickets() {
    const json = await fetch("http://localhost:7070/?method=allTickets");
    const response = await json.json();
    console.log(response);

    //return this.getTickets(response);
  }

  async getTickets(arr) {
    await arr.forEach((el) => {
      const ticket = new this.ItemType(el);
      this.ticketList.append(ticket);
      this.tickets.push(ticket);
    });
  }

  addTicket(data) {
    const ticket = new this.ItemType(data);
    this.ticketList.append(ticket.element);
  }

  async sendCreateTicket(e, form) {
    e.preventDefault();

    const formData = new FormData(form);
    try {
      const response = await fetch(
        "http://localhost:7070/?method=createTicket",
        {
          method: "POST",
          mode: "cors",
          body: formData,
          headers: new Headers(),
        }
      );

      const json = await response.json();

      if (json.err) {
        console.log(json.err);
        //добавить вывод о том, что есть ошибка
        return;
      }

      this.addTicket(json);
    } catch (e) {
      console.log(e);
    }
    form.reset();
    this.popupControl.removePopup(form);
  }

  onBtnAddTicket() {
    const form = this.formControl.form;
    const cancelBtn = this.formControl.cancel;
    form.addEventListener("submit", (e) => this.sendCreateTicket(e, form));
    this.popupControl.showPopup(form, this.element);
    cancelBtn.addEventListener("click", (e) =>
      this.popupControl.removePopup(form, e)
    );
  }
}
