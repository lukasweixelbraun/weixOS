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