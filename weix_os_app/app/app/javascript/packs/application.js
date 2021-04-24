// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"

Rails.start()
Turbolinks.start()
ActiveStorage.start()

//var x = el.offsetLeft, y = el.offsetTop;

var appWidth = 150, appHight = 150;
var dragElement = ""

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
  var gridY = Math.ceil(y / appHight); // dropped into gridY
 
  var leftTotal = gridX / desktop_grid_anzahl_x() * 100; // left: %
  var topTotal = gridY / desktop_grid_anzahl_y() * 100; // top: %

  // transform -50%
  var left = leftTotal - (appWidth / window.innerWidth * 100);
  var top = topTotal - (appHight / window.innerHeight * 100);

  el.style.left = left + "%";
  el.style.top = top + "%";

  $.ajax({
    global: false,
    type: "POST",
    url: "/apps/update_pos",
    dataType: 'json',
    data: {
         id: app_id,
         pos_x: left,
         pos_y: top
    },
    success: function (response) {
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
  return windowHeight / appHight; // insgesamt anzahl an grids
}