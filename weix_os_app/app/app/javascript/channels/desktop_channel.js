window.closeSystemMenu = function(e) {
  e.preventDefault();
  var systemMenu = document.getElementById('system-menu-box');

  if(systemMenu.classList.contains('hidden') == false) {
    systemMenu.classList.add('hidden');
  }

  closeContextMenus();
}

window.openContextMenu = function(event, contextTemplate, idApp) {
  event.preventDefault();
  closeContextMenus();

  var x = event.clientX;
  var y = event.clientY;

  if(y + 300 > window.innerHeight) {
    y -= 300;
  }

  if(x + 200 > window.innerWidth) {
    x -= 200;
  }

  $.ajax({
    global: false,
    type: "POST",
    url: "/my_apps/open_context_menu",
    dataType: 'html',
    data: {
      id: idApp,
      template: contextTemplate
    },
    success: function (html) {
      var desktop = document.getElementById('desktop');

      var menu = document.createElement('div');
      menu.classList.add('context-menu');
      menu.style.left = x + "px";
      menu.style.top = y + "px";
      menu.innerHTML = html;

      desktop.appendChild(menu);
    }
  });
}

window.closeContextMenus = function() {
  document.querySelectorAll('.context-menu').forEach(e => e.remove());
}