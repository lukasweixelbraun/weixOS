import { Desktop } from "../controller/desktop_controller"

// ------------------------------ DESKTOP EVENTS ------------------------------

const desktop : Desktop = Desktop.getInstance();

$(document).on("drop", '#desktop', function(event) {
  var app = desktop.getDragApp();
  app.move(event.clientX, event.clientY);
});

$(document).on("dragover", '#desktop', function(event) {
  event.preventDefault();
});

//TODO
function createSystemMessage(type : string, title : string, message : string, inputs : any) {
  desktop.createSystemMessage(type, title, message, inputs);
}

function closeContextMenus() {
  desktop.closeContextMenus();
}

function dismissSystemMessage() {
  desktop.dismissSystemMessage();
}