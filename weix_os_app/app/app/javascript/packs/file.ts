import { File } from "../controller/file_controller"

$(document).on("dblclick", '.file-entry', function(event) {
  event.stopPropagation();
  var element = event.target.closest('tr');
  const { filePath, fileType } = element.dataset;
  var file = new File(filePath, fileType);

  if(fileType == 'dir') {
    file.chdir();
  } else {
    file.download();
  }
  
});

$(document).on("contextmenu", '.file-entry', function(event) {
  event.stopPropagation();
  var element = event.target.closest('tr');
  const { filePath } = element.dataset;
  console.log(filePath);
  //TODO Open Context Menu
});

$(document).on("change", '.file-input', function(event) {
  event.preventDefault();

  var files = this.files;
  var data = new FormData();

  for (var x = 0; x < files.length; x++) {
    data.append("files[]", files[x]);
  }

  $.ajax({
    global: false,
    type: "POST",
    processData: false,
    contentType: false,
    url: "/file_system/upload",
    data: data,
    dataType: 'html',
    success: function(html) {
      var file_table = document.getElementById('system-files');
      file_table.innerHTML = html;
    }
  });

  return false;
});