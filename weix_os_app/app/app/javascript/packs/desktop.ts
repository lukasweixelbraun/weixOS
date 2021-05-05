import { Desktop } from "../controller/desktop_controller"

// ------------------------------ DESKTOP EVENTS ------------------------------

const desktop : Desktop = Desktop.getInstance();

$(document).on("dragover", '#desktop', function(event) {
  event.preventDefault();
});

$(document).on("click", '#system-message-cancel', function(event) {
  event.preventDefault();
  desktop.dismissSystemMessage();
});

$(document).on("click", '#system-message-ok', function(event) {
  event.preventDefault();
  desktop.dismissSystemMessage();
});