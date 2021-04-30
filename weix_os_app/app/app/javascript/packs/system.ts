import { Desktop } from "../controller/desktop_controller"
import { Toolbar } from "../controller/toolbar_controller"

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

window.addEventListener("load", (event) => {
  toolbar.getSystemTime();
  desktop.loadApps(event);
});