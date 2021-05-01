import { ContextMenu, ContextMenuFunctions } from "../controller/context_menu_controller";
import { Desktop } from "../controller/desktop_controller"
import { Toolbar } from "../controller/toolbar_controller"

const desktop : Desktop = Desktop.getInstance();
const toolbar : Toolbar = Toolbar.getInstance();
const context_menu : ContextMenu = ContextMenu.getInstance();

// --- Disable Default Contextmenu ---

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  desktop.closeContextMenus();
}, false);

window.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  desktop.closeContextMenus();
}, false);

document.addEventListener('click', function(e) {
  e.preventDefault();
  desktop.closeContextMenus();
}, false);

window.addEventListener('click', function(e) {
  e.preventDefault();
  desktop.closeContextMenus();
}, false);

window.addEventListener("load", (event) => {
  toolbar.getSystemTime();
  desktop.loadApps(event);
});

$(document).on("click", '.app-search-result', function(event) {
  event.stopPropagation();
  var element = event.target.closest('button');
  const { appId } = element.dataset;
  var app = Desktop.getInstance().getApp(appId);
  app.openWindow(event);
});

$(document).on("contextmenu", '.app-search-result', function(event) {
  event.stopPropagation();
  var element = event.target.closest('button');
  const { appId } = element.dataset;
  Desktop.getInstance().openContextMenu(event, 'toolbar_app', appId);
});

$(document).on("click", '.context-menue-item', function(event) {
  event.stopPropagation();
  var element = event.target.closest('button');
  const { appId, contextMenue } = element.dataset;
  var app = Desktop.getInstance().getApp(appId);

  if(contextMenue == ContextMenuFunctions.addToDesktop) {
    app.addToDesktop();
  } else if(contextMenue == ContextMenuFunctions.removeFromDesktop) {
    app.removeFromDesktop();
  } else if(contextMenue == ContextMenuFunctions.addToToolbar) {
    app.addToToolbar();
  } else if(contextMenue == ContextMenuFunctions.removeFromToolbar) {
    app.removeFromToolbar();
  }
});