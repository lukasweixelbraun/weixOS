import { Desktop } from "../controller/desktop_controller"
import { File } from "../controller/file_controller"

const desktop : Desktop = Desktop.getInstance();

$(document).on("dblclick", '.file-entry', function(event) {
  event.stopPropagation();
  var element = event.target.closest('tr');
  const { filePath } = element.dataset;
  var file = new File(filePath);
  file.download();
});

$(document).on("contextmenu", '.file-entry', function(event) {
  event.stopPropagation();
  var element = event.target.closest('tr');
  const { filePath } = element.dataset;
  console.log(filePath);
  //TODO Open Context Menu
});