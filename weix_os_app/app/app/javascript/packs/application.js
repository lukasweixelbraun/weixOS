// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import moment from "moment"
import "channels"

Rails.start()
Turbolinks.start()
ActiveStorage.start()


// --- Drag and Drop Apps ---

var appWidth = 140, appHeight = 130;
var dragElement = "";

window.allowAppDrop = function(ev) {
  ev.preventDefault();
}

window.dragApp = function(ev) {
  dragElement = ev.target.closest('div').id;
}

window.dropApp = function(ev) {
  ev.preventDefault();
  var el = document.getElementById(dragElement);
  var app_id = dragElement.replace("app-", "");

  var x = ev.clientX, y = ev.clientY;

  var gridX = Math.ceil(x / appWidth); // dropped into gridX
  var gridY = Math.ceil(y / appHeight); // dropped into gridY
 
  var leftTotal = gridX / desktop_grid_anzahl_x() * 100; // left: %
  var topTotal = gridY / desktop_grid_anzahl_y() * 100; // top: %

  // transform -50%
  var left = leftTotal - (appWidth / window.innerWidth * 100);
  var top = topTotal - (appHeight / window.innerHeight * 100);

  if((window.innerWidth / 100 * left + appWidth) > window.innerWidth) {
    x -= appWidth;
    gridX = Math.ceil(x / appWidth); // dropped into gridX
    leftTotal = gridX / desktop_grid_anzahl_x() * 100; // left: %
    left = leftTotal - (appWidth / window.innerWidth * 100);
  }

  if((window.innerHeight / 100 * top + appHeight) > window.innerHeight) {
    y -= appHeight;
    gridY = Math.ceil(y / appHeight); // dropped into gridY
    topTotal = gridY / desktop_grid_anzahl_y() * 100; // top: %
    top = topTotal - (appHeight / window.innerHeight * 100);
  }

  el.style.left = left + "%";
  el.style.top = top + "%";

  $.ajax({
    global: false,
    type: "POST",
    url: "/my_apps/update_pos",
    dataType: 'json',
    data: {
         id: app_id,
         pos_x: left,
         pos_y: top
    },
    error: function (response) {
        console.log(response);
    }
  });
}

window.desktop_grid_anzahl_x = function() {
  var windowWidth = window.innerWidth;
  return windowWidth / appWidth; // insgesamt anzahl an grids
}

window.desktop_grid_anzahl_y = function() {
  var windowHeight = window.innerHeight;
  return windowHeight / appHeight; // insgesamt anzahl an grids
}


// --- App Window Drag ---

function enableDrag(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var title_bar = null;

  for (var i = 0; i < elmnt.childNodes.length; i++) {
    if (elmnt.childNodes[i].className == "app-title-bar") {
      title_bar = elmnt.childNodes[i];
      break;
    }        
  }

  if (title_bar != null) {
    // if present, the header is where you move the DIV from:
    title_bar.onmousedown = dragMouseDown;
  } else {
    // otherwise - dont move the div
    e.preventDefault();
    return;
  }

  function dragMouseDown(e) {
    title_bar.style.cursor = "move"; 

    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    title_bar.style.cursor = "default";

    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function addToToolbar(app_id, img_src) {
  var toolbar = document.getElementById('pinned-applications');

  var element = document.createElement('div');
  element.classList.add('element');
  element.setAttribute('id', ('element-app-id-' + app_id));

  var app = document.createElement('div');
  app.classList.add('app');

  var app_icon = document.createElement('img');
  app_icon.classList.add('icon');
  app_icon.setAttribute('src', img_src);
  app.appendChild(app_icon);

  element.appendChild(app);

  element.addEventListener('click', () => { hideApp(null, app_id); }, false );

  toolbar.appendChild(element);
}

// -- Open App Window ---

window.openApp = function(e, app_id, img_src) {

  if(document.getElementById('element-app-id-' + app_id)) {
    if(document.getElementById('app-window-id-' + app_id).classList.contains('hidden')) {
      hideApp(e, app_id);
    }
    return;
  }

  $.ajax({
    global: false,
    type: "POST",
    url: "/my_apps/open_window",
    dataType: 'html',
    data: {
         id: app_id
    },
    success: function (html) {
      var app = document.createElement('div');
      app.innerHTML = html;

      while(app.firstChild) {
        document.getElementById('desktop').appendChild(app.firstChild);
      }

      addToToolbar(app_id, img_src);
      enableDrag(document.getElementById('app-window-id-' + app_id));
    }
  });
}


window.hideApp = function(e, id) {
  document.getElementById('app-window-id-' + id).classList.toggle('hidden');
}

window.appFullscreen = function(e, id) {
  document.getElementById('app-window-id-' + id).classList.toggle('fullscreen');
}

window.closeApp = function(e, id) {
  document.getElementById('app-window-id-' + id).remove();
  document.getElementById('element-app-id-' + id).remove();
}


// --- Date Time for System Time ---

window.getSystemTime = function() {
  let now = moment().format('dd, DD. MMM HH:mm');
  document.getElementById('system-time').textContent = now;
}

setInterval(getSystemTime, 2000);