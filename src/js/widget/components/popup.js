import "../css/popup.css";

export default class PopupController {
  constructor(onElement) {
    this.inElement = document.body;
    this.onElement = onElement;
    this.actualPopups = [];

    this.removePopup = this.removePopup.bind(this);
  }

  showPopup(element, onElement) {
    const { top, left } = onElement.getBoundingClientRect();

    console.log(element);
    element.classList.add("popup");
    document.body.append(element);

    element.style.top = `${
      top - 30 + onElement.offsetHeight / 2 - element.offsetHeight / 2
    }px`;
    element.style.left = `${
      left - 30 + onElement.offsetWidth / 2 - element.offsetWidth / 2
    }px`;
  }

  removePopup(element, e) {
    if (e) {
      e.preventDefault();
    }
    console.log(this.activePopup);
    element.remove();
  }
}
