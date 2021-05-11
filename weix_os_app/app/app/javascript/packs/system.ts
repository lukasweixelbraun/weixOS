import { ContextMenuFunctions } from "../controller/context_menu_controller";
import { Desktop } from "../controller/desktop_controller"
import { Toolbar } from "../controller/toolbar_controller"
import { getSystemMessages } from "../controller/system_message_controller"

const desktop : Desktop = Desktop.getInstance();
const toolbar : Toolbar = Toolbar.getInstance();

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
  toolbar.cloesDetailedSystemInfo();
}, false);

window.addEventListener('click', function(e) {
  e.preventDefault();
  desktop.closeContextMenus();
  toolbar.cloesDetailedSystemInfo();
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

$(document).on("click", '.open-system-message', function(event) {
  event.stopPropagation();
  var element = event.target.closest('button');
  const { systemMessage } = element.dataset;
  desktop.createSystemMessage(getSystemMessages(systemMessage));
});

$(document).on("click", '#system-time', function(event) {
  event.stopPropagation();
  toolbar.toggleDetailedSystemInfo();
});

// Analog System Messages machen?
$(document).on("click", '.context-menue-item', function(event) {
  event.stopPropagation();
  var element = event.target.closest('button');
  const { appId, contextMenue } = element.dataset;
  var app = Desktop.getInstance().getApp(appId);

  if(contextMenue == ContextMenuFunctions.addToDesktop) {
    app.addToDesktop();
  } else if(contextMenue == ContextMenuFunctions.removeFromDesktop) {
    app.removeFromDesktop();
  } else if(contextMenue == ContextMenuFunctions.addToFavorites) {
    app.addToFavorites();
  } else if(contextMenue == ContextMenuFunctions.removeFromFavorites) {
    app.removeFromFavorites();
  }
});