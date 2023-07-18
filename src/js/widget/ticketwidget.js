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
    this.sendRequest = this.sendRequest.bind(this);

    this.btnAddTicket.addEventListener("click", this.onBtnAddTicket);
    document.addEventListener("DOMContentLoaded", () =>
      this.sendRequest({ type: "GET", method: "allTickets" })
    );
  }

  async editBind(data) {
    const response = await fetch(
      `http://localhost:7070/?method=ticketById&id=${data.id}`
    );
    const json = await response.json();
    const { form, cancelBtn, acceptBtn } = this.formControl.getEditForm(
      data.name,
      json.description
    );
    form.addEventListener("submit", (e) => {
      this.sendRequest(
        { type: "PUT", method: "updateById", id: data.id },
        form,
        e
      );
    });
    this.popupControl.showPopup(form, this.element);
    cancelBtn.addEventListener("click", (e) => {
      if (e.target !== acceptBtn) {
        this.popupControl.removePopup(form, e);
      }
    });
  }

  async bindTicket(ticket) {
    const ticketElement = ticket.element;
    const data = ticket.data;
    const { status, edit, remove } = ticket.btns;
    ticketElement.addEventListener("click", (e) => {
      if (e.target === edit) {
        this.editBind(data);
      } else if (e.target === remove) {
        const { element, cancel, accept } = this.confirmControl.getConfObj();
        this.popupControl.showPopup(element, ticketElement);

        cancel.addEventListener("click", (e) =>
          this.popupControl.removePopup(element, e)
        );
        accept.addEventListener("click", () => {
          this.sendRequest(
            { type: "DELETE", method: "deleteById", id: ticket.getId() },
            element,
            e
          );
        });
      } else if (e.target === status) {
        this.sendRequest({
          type: "PUT",
          method: "updateById",
          id: data.id,
          status: { key: "status", value: "done" },
        });
      } else {
        this.sendRequest({ type: "GET", method: "ticketById", id: data.id });
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

    const { type, method, id, status } = data;
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
            headers: new Headers(),
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
          headers: new Headers(),
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
      const { type, ticket, description, status, id } = data;
      if (type === "create") {
        this.createTicket(ticket);
      } else if (type === "description") {
        this.addDescription(description, id);
      } else if (type === "status") {
        this.changeStatus(status, id);
      } else if (type === "deleted") {
        this.removeTicket(id);
      }
      //закончил тут
    }
  }

  addDescription(description, id) {
    const ticket = this.tickets.find((el) => el.getId() === id);
    ticket.showDescription(description);
  }

  changeStatus(status, id) {
    const ticket = this.tickets.find((el) => el.getId() === id);
    ticket.changeStatus(status);
  }

  createTicket(data) {
    const ticket = new this.ItemType(data);
    this.bindTicket(ticket);
    this.ticketList.append(ticket.element);
    this.tickets.push(ticket);
  }

  removeTicket(id) {
    const ticket = this.tickets.find((el) => el.id === id);

    ticket.element.remove();
    this.tickets = this.tickets.filter((el) => el.id !== id);
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
