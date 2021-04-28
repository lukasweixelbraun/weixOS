import { Toolbar } from "../controller/toolbar_controller"

// ------------------------------ TOOLBAR EVENTS ------------------------------

const toolbar : Toolbar = Toolbar.getInstance();
var typingTimer = void 0; // void 0 for the memes
var doneTypingInterval = 300;

toolbar.getSystemTime();

$(document).on("click", function() {
  toolbar.closeSystemMenu();
});

$(document).on("click", '.system-menu', function(event) {
  event.stopPropagation();
});

$(document).on("click", '#open-menu-btn', function(event) {
  event.preventDefault();
  toolbar.openSystemMenu();
  event.stopPropagation();
});

$(document).on("keyup", '#app-search-input', function(event) {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(toolbar.searchApp, doneTypingInterval, event.target.value);
  return;
});

$(document).on("click", '#log-out-btn', function() {
  toolbar.logOut();
});