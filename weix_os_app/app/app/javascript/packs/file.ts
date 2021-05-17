import { File } from "../controller/file_controller"
import { Desktop } from "../controller/desktop_controller"
import { getSystemMessages } from "../controller/system_message_controller"
import { ContextMenuFunctions } from "../controller/context_menu_controller";

const desktop : Desktop = Desktop.getInstance();

// download or chdir
$(document).on("dblclick", '.file-entry', function(event) {
  event.stopPropagation();
  var element = event.target.closest('tr');
  const { fileName, filePath, fileType } = element.dataset;
  var file = new File(fileName, filePath, fileType);

  if(fileType == 'dir') {
    file.chdir();
  } else {
    file.download();
  }
  
});


//file navigation
$(document).on("click", '.file-nav-element', function(event) {
  event.stopPropagation();
  var element = event.target.closest('a');
  const { fileName, filePath, fileType } = element.dataset;
  var file = new File('', filePath, '');
  file.chdir();
});


// create dir
$(document).on("click", '#add-folder', function(event) {
  event.stopPropagation();
  var add_dir_prompt = document.getElementById('add-folder-container');

  add_dir_prompt.classList.toggle('hidden');

  if(!add_dir_prompt.classList.contains('hidden')) {
    var input = document.getElementById('dir_name') as HTMLInputElement;
    input.focus();
    input.select();
  }
});

$(document).on("click", '.add-folder-form', function(event) {
  event.stopPropagation();
});

$(document).on("click", '.file-window', function(event) {
  var add_dir_prompt = document.getElementById('add-folder-container');

  if(!add_dir_prompt.classList.contains('hidden')) {
    add_dir_prompt.classList.add('hidden');
  }
});

$(document).on("click", '#dir-add', async function(event) {
  event.preventDefault();

  Desktop.getInstance().showLoading();

  var input = document.getElementById('dir_name') as HTMLInputElement;
  var error = false;

  await $.ajax({
    global: false,
    type: "POST",
    url: "/file_system/create_dir",
    data: {
      name: input.value
    },
    dataType: 'html',
    success: function(html) {
      var file_table = document.getElementById('system-files');
      file_table.innerHTML = html;
    },
    error: function(e) {
      error = true;
      desktop.createSystemMessage(getSystemMessages("mkdir_error"));
    }
  });

  Desktop.getInstance().stopLoading();

  if(error === false) {
    var add_dir_prompt = document.getElementById('add-folder-container');

    if(!add_dir_prompt.classList.contains('hidden')) {
      add_dir_prompt.classList.add('hidden');
    }

    input.value = "Neuer Ordner";
  }

  return false;
});

// context menue
$(document).on("contextmenu", '.file-entry', function(event) {
  event.stopPropagation();
  var element = event.target.closest('tr');
  const { fileName, filePath, fileType } = element.dataset;
  var file = new File(fileName, filePath, fileType);
  
  file.openContextMenu(event, fileType);
});

$(document).on("click", '.context-menue-item', function(event) {
  event.stopPropagation();
  var element = event.target.closest('button');
  const { fileName, filePath, fileAction } = element.dataset;

  var file = new File(fileName, filePath, '');

  if(fileAction == 'download') {
    file.download();
  } else if(fileAction == 'delete') {
    file.delete();
  }
});

// upload
$(document).on("change", '.file-input', async function(event) {
  Desktop.getInstance().showLoading();
  event.preventDefault();

  var files = this.files;
  var data = new FormData();

  for (var x = 0; x < files.length; x++) {
    data.append("files[]", files[x]);
  }

  await $.ajax({
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

  Desktop.getInstance().stopLoading();

  return false;
});