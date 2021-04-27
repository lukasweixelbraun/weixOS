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

window.addToToolbar = function(app_id, img_src) {
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

  element.addEventListener('contextmenu', (event) => { openContextMenu(event, 'toolbar_app', app_id); }, false );

  toolbar.appendChild(element);
}

window.desktopLink = function(e, id, createDesktopLink) {
  e.preventDefault();

  $.ajax({
    global: false,
    type: "POST",
    url: "/my_apps/create_sym_link",
    dataType: 'json',
    data: {
      id: id,
      desktop_link: createDesktopLink
    },
    success: function (data) {
      if(createDesktopLink) {
        // add app icon to desktop
        $.ajax({
          global: false,
          type: "POST",
          url: "/my_apps/add_app_to_desktop",
          dataType: 'html',
          data: {
            id: id
          },
          success: function (html) {
            var desktop = document.getElementById('desktop');
            var app = document.createElement('div');
            app.innerHTML = html;
            desktop.appendChild(app.firstChild);
          }
        });
      } else {
        // remove app icon from desktop
        document.getElementById('app-' + id).remove();
      }
    }
  });

}