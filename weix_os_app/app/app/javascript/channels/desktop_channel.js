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
      menu.innerHTML = html;

      desktop.appendChild(menu);

      if(y + menu.offsetHeight > window.innerHeight) {
        y = window.innerHeight - menu.offsetHeight - 10;
      }
    
      if(x + menu.offsetWidth > window.innerWidth) {
        x = window.innerWidth - menu.offsetWidth - 10;
      }

      menu.style.left = x + "px";
      menu.style.top = y + "px";
    }
  });
}

window.closeContextMenus = function() {
  document.querySelectorAll('.context-menu').forEach(e => e.remove());
}

window.createSystemMessage = function(type, title, message, inputs) {
  /*
    inputs = [{
      id: "inp1",
      class: "inp1-style",
      type: "email",
      label: "Email",
      onChange: () => { console.log("EMAIL CHANGED!"); }
    },
    {
      id: "inp2",
      class: "inp2-style",
      type: "password",
      label: "Passwort",
      onChange: () => { console.log("PASSWORD CHANGED!"); }
    }]
  */

  $.ajax({
    global: false,
    type: "post",
    url: "/system/create_message",
    dataType: 'html',
    data: {
      type: type,
      title: title,
      message: message,
      inputs: inputs
    },
    success: function (html) {
      var desktop = document.getElementById('desktop');

      var systemMessage = document.createElement('div');
      systemMessage.classList.add('system-message');
      systemMessage.innerHTML = html;

      desktop.appendChild(systemMessage);

      document.getElementById('system-message-overlay').classList.toggle('hidden');
    }
  });

}

window.dismissSystemMessage = function(e, result) {
  document.getElementById('system-message-overlay').classList.toggle('hidden');
  document.querySelectorAll('.system-message').forEach(e => e.remove());
}