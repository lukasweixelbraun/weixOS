import { Desktop } from "../controller/desktop_controller"

// ------------------------------ APP EVENTS ------------------------------

function addToToolbar(id : number) {
  var app = Desktop.getInstance().getApp(id);
  app.addToToolbar();
}

function removeFromToolbar(id : number) {
  var app = Desktop.getInstance().getApp(id);
  app.removeFromToolbar();
}

function addToDesktop(event, id : number) {
  event.preventDefault();
  var app = Desktop.getInstance().getApp(id);
  app.addToDesktop();
}

function removeFromDesktop(event, id : number) {
  event.preventDefault();
  var app = Desktop.getInstance().getApp(id);
  app.removeFromDesktop();
}