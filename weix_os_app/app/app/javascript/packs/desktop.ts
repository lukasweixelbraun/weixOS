import { Desktop } from "../controller/desktop_controller"

// ------------------------------ DESKTOP EVENTS ------------------------------

var dragAppId = 0;

const desktop : Desktop = Desktop.getInstance();

// TODO
function addApp(id : number, pos_x : number, pos_y : number, name : string, img_src : string) {
  desktop.appendApp(id, pos_x, pos_y, name, img_src);
}

// TODO
function dragApp(event) {
  var dragElement = event.target.closest('div').id;
  dragAppId = dragElement.replace("app-", "");
}

$(document).on("drop", '#desktop', function(event) {
  var app = desktop.getApp(dragAppId);
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