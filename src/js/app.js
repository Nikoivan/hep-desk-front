import TicketWidget from "./widget/ticketwidget";
import FormController from "./widget/components/form";
import PopupController from "./widget/components/popup";
import ConfirmController from "./widget/components/confirm";
import Ticket from "./widget/components/ticket";

const settings = {
  parentName: "wrapper",
  Form: FormController,
  Popup: PopupController,
  Confirm: ConfirmController,
  Ticket,
};

const ticketWidget = new TicketWidget(settings);
