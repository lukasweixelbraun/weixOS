// --- App Window Drag ---

function enableDrag(app_id, elmnt) {
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
    document.getElementById('desktop').style.cursor = "move"; 

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
    if((elmnt.offsetTop - (elmnt.offsetHeight / 2) - pos2) >= 0) {
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    } else {
      elmnt.style.top = (elmnt.offsetHeight / 2) + "px";
    }

    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

    // check tiling
    if(e.clientY <= 15) {
      tiling(e, 'top');
    } else if(e.clientX <= 50) {
      tiling(e, 'left');
    } else if(e.clientX >= window.innerWidth - 50) {
      tiling(e, 'right');
    } else {
      tiling(e, 'no tiling');
    }
  }

  //TODO tiling is kinda WIP
  function tiling(e, direction) {
    if(direction == 'top') {
      elmnt.classList.add('fullscreen');
    } else if(direction != 'no tiling') {
      elmnt.classList.add('tiling-' + direction);
    } else {
      //remove fullscreen if enabled
      if(elmnt.classList.contains('fullscreen')) {
        elmnt.classList.remove('fullscreen');

        elmnt.style.top = (((elmnt.offsetHeight + 25) / 2) - pos4) + "px";
        elmnt.style.left = pos3 + "px";
      } else {
        elmnt.classList.remove('tiling-left');
        elmnt.classList.remove('tiling-right');
      }
    }
  }

  function closeDragElement() {
    document.getElementById('desktop').style.cursor = "default";

    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    var left = 50;
    var top = 50;

    if(elmnt.style.left.includes("px")) {
      left = elmnt.style.left.replace("px", "");
      left = left / window.innerWidth * 100;
    } else if(elmnt.style.left.includes("%")) {
      left = elmnt.style.left.replace("%", "");
    }

    if(elmnt.style.top.includes("px")) {
      top = elmnt.style.top.replace("px", "");
      top = top / window.innerHeight * 100;
    } else if(elmnt.style.top.includes("%")) {
      top = elmnt.style.top.replace("%", "");
    }

    $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/update_window_pos",
      dataType: 'json',
      data: {
           id: app_id,
           window_pos_x: left,
           window_pos_y: top
      },
      error: function (response) {
          console.log(response);
      }
    });
  }
}





// -- Open App Window ---

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

  element.addEventListener('click', (event) => { hideApp(event, app_id); }, false );

  //TODO open contextmenu
  element.addEventListener('contextmenu', (event) => { closeApp(event, app_id); }, false );

  toolbar.appendChild(element);
}


window.openApp = function(e, app_id, img_src, window_pos_x, window_pos_y) {

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
          id: app_id,
          window_pos_x: window_pos_x,
          window_pos_y: window_pos_y
    },
    success: function (html) {
      var app = document.createElement('div');
      app.innerHTML = html;

      while(app.firstChild) {
        document.getElementById('desktop').appendChild(app.firstChild);
      }

      addToToolbar(app_id, img_src);
      enableDrag(app_id, document.getElementById('app-window-id-' + app_id));
    }
  });
}


window.hideApp = function(e, id) {
  e.preventDefault();
  document.getElementById('app-window-id-' + id).classList.toggle('hidden');
}

window.appFullscreen = function(e, id) {
  e.preventDefault();
  document.getElementById('app-window-id-' + id).classList.toggle('fullscreen');
}

window.closeApp = function(e, id) {
  e.preventDefault();
  document.getElementById('app-window-id-' + id).remove();
  document.getElementById('element-app-id-' + id).remove();

  $.ajax({
    global: false,
    type: "POST",
    url: "/my_apps/close_window",
    dataType: 'json',
    data: {
          id: id
    },
    error: function (e) {
      console.log(e);
    }
  });
}