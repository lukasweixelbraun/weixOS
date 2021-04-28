import { Desktop } from "../controller/desktop_controller"

// ------------------------------ WINDOW EVENTS ------------------------------

function openNewWindow(event, id : number) {
  event.preventDefault();
  var app = Desktop.getInstance().getApp(id);
  app.openWindow(event, 50, 50, "");
}

function openWindow(event, appId : number, pos_x : number, pos_y : number, last_state : string) {
  event.preventDefault();
  var app = Desktop.getInstance().getApp(appId);
  app.openWindow(event, pos_x, pos_y, last_state);
}

function closeWindow(id : number) {
  var app = Desktop.getInstance().getApp(id);
  app.closeWindow();
}

function hideWindow(id : number) {
  var app = Desktop.getInstance().getApp(id);
  app.hideWindow();
}

function fullscreenWindow(id : number) {
  var app = Desktop.getInstance().getApp(id);
  app.fullscreenWindow();
}