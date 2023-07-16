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
    console.log(widget);
    parentEl.append(widget);

    this.element = widget;
    this.ticketList = this.element.querySelector(".ticket-list");
    this.btnAddTicket = this.element.querySelector(".add-ticket");
    this.popupControl = new Popup(this.ticketList);

    this.onBtnAddTicket = this.onBtnAddTicket.bind(this);
    this.sendRequest = this.sendRequest.bind(this);

    this.btnAddTicket.addEventListener("click", this.onBtnAddTicket);
    document.addEventListener("DOMContentLoaded", () =>
      this.sendRequest({ type: "GET", method: "allTickets" })
    );
  }

  bindTicket(ticket) {
    const ticketElement = ticket.element;
    const data = ticket.data;
    const { edit, remove } = ticket.btns;
    ticketElement.addEventListener("click", (e) => {
      if (e.target === edit) {
        const { form, cancelBtn, acceptBtn } =
          this.formControl.getEditForm(data);
        // form.addEventListener("submit", (e) => this.sendRequest(e, form)); запрос на изменение тикета
        this.popupControl.showPopup(form, this.element);
        cancelBtn.addEventListener("click", (e) => {
          if (e.target !== acceptBtn) {
            this.popupControl.removePopup(form, e);
          }
        });
      } else if (e.target === remove) {
        const { element, cancel, accept } = this.confirmControl.getConfObj();
        this.popupControl.showPopup(element, ticketElement);

        cancel.addEventListener("click", (e) =>
          this.popupControl.removePopup(element, e)
        );
        accept.addEventListener("click", () => {
          ticket.remove;
          this.sendRequest(
            { type: "DELETE", method: "deleteById", id: ticket.getId() },
            e
          );
          this.popupControl.removePopup(element, e);
        });
      }
    });
  }

  addTickets(arr) {
    this.tickets.forEach((el) => el.remove());
    this.tickets = [];
    arr.forEach((el) => {
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

    const { type, method, id } = data;
    let response;

    try {
      let fullUrl = url + method;
      if (id) {
        fullUrl += `&id=${id}`;
      }
      if (type === "GET" || type === "DELETE") {
        if (type === "GET") {
          response = await fetch(fullUrl);
          console.log(`get - response = ${response}`);
        } else {
          response = await fetch(fullUrl, {
            method: type,
            mode: "cors",
            headers: new Headers(),
          });
          console.log(`delete - response = ${response}`);
        }
      } else if (type === "POST") {
        console.log(`post - ${type}`);
        const formData = new FormData(form);
        response = await fetch(fullUrl, {
          method: type,
          mode: "cors",
          body: formData,
          headers: new Headers(),
        });
        console.log(`Post - response = ${response}`);
      }
      const json = await response.json();
      console.log(json);
      if (json.err) {
        console.log(json.err);
        //добавить вывод о том, что есть ошибка
        return;
      }
      this.addTickets(json);
    } catch (e) {
      console.log(e);
    }

    if (form) {
      form.removeEventListener("submit", (e) => {
        this.sendRequest({ type: "POST", method: "createTicket" }, form, e);
      });
      form.reset();
      this.popupControl.removePopup(form);
    }

    //GET    ?method=allTickets - список тикетов
    //GET    ?method=ticketById&id=<id> - полное описание тикета (где <id> - идентификатор тикета)
    //DELETE    ?method=deleteById&id=<id> - удалить объект типа Ticket по id, при успешном запросе статус ответа 204
    //POST   ?method=createTicket - в теле запроса форма с полями для объекта типа Ticket (с id = null)
    //POST   ?method=updateById&id=<id> - в теле запроса форма с полями для обновления объекта типа Ticket по id
  }

  onBtnAddTicket() {
    const { form, cancelBtn } = this.formControl.createForm;

    form.addEventListener("submit", (e) => {
      this.sendRequest({ type: "POST", method: "createTicket" }, form, e);
    });
    this.popupControl.showPopup(form, this.element);
    cancelBtn.addEventListener("click", (e) =>
      this.popupControl.removePopup(form, e)
    );
  }
}
