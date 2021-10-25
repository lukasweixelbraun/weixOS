import { App } from "./app_controller"
import { SystemMessage } from "./system_message_controller";
import { AppWindow } from "./window_controller";

$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  }
});

export class Desktop {

  private desktopElement : HTMLElement = null;
  private static instance : Desktop;
  private apps : App[] = [];

  private dragElementId :number = 0;

  private constructor() {

  }

  public async loadApps(event) {
    await $.ajax({
      global: false,
      type: "post",
      url: "/system/load_apps",
      dataType: 'json',
      success: function (data) {
        if(data !== undefined) {
          data['apps'].forEach(app_data => {
            var user_settings = data['user_data'].find((user_data : any) => app_data.id == user_data.app_id);
            var pos_x = 50;
            var pos_y = 50;
            var desktop_link = false;
            var toolbar_link = false;

            if(user_settings != undefined) {
              pos_x = user_settings.pos_x;
              pos_y = user_settings.pos_y;
              desktop_link = user_settings.desktop_link;
              toolbar_link = user_settings.toolbar_link;
            }

            var app = new App(app_data.id, 
                    pos_x, pos_y, 
                    app_data.name, 
                    app_data.template_name, 
                    app_data.img_src, 
                    desktop_link,
                    toolbar_link);

            var window : AppWindow = null;

            // Wenn die App noch offen ist, wird das Fenster erzeugt und auf open = false gesetzt, dass app.openWindow() nicht returnt
            if(user_settings != undefined && user_settings.is_opened) {
              window = new AppWindow(app_data.id,
                app_data.template_name, 
                user_settings.window_pos_x,
                user_settings.window_pos_y,
                user_settings.last_state,
                false,
                app.getCloseWindowCallback()
              );
            }

            if(window != null) {
              app.setWindow(window);
              app.openWindow(event);
            } else if(app.hasToolbarLink() == true) {
              app.addToToolbar();
            }

            if(app.hasDesktopLink() == true) {
              app.addToDesktop();
            }

            Desktop.getInstance().appendApp(app);
          });
        }
      }
    });

    // add drop event listener
    this.getElement().addEventListener('drop', (event : any) => {
      var app = this.getDragApp();
      if(app === undefined) {
        return;
      }
      
      app.move(event.clientX, event.clientY);
    }, false);
    
  }

  public appendApp(app : App) {
    this.apps.push(app);
  }

  public getDragApp() {
    return this.getApp(this.dragElementId);
  }

  public setDragApp(id : number) {
    this.dragElementId = id;
  }

  public getApp(id : number) {
    var app : App = this.apps.find((a : App) => a.getId() == id);

    if(app == undefined || app == null) {
      //TODO fetch app from db!
    }

    return app;
  }

  public static getInstance() {
    if(this.instance == null) {
      this.instance = new Desktop();
    } 
    
    return this.instance;
  }

  public getElement() {
    if(this.desktopElement == null) {
      this.desktopElement = document.getElementById('desktop');
    }

    return this.desktopElement;
  }

  public createSystemMessage(sysMessage : SystemMessage) {
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
        type: sysMessage.type,
        title: sysMessage.title,
        message: sysMessage.message
      },
      success: function (html) {
        var body = document.getElementsByTagName('body')[0];
        var desktop = document.getElementById('desktop');

        var systemMessage = document.createElement('div');
        systemMessage.classList.add('system-message');
        systemMessage.innerHTML = html;

        body.appendChild(systemMessage);

        desktop.classList.toggle('blur');
        document.getElementById('system-message-overlay').classList.toggle('hidden');
      }
    });
  }

  public showLoading() {
    this.getElement().classList.add('loading');
  }

  public stopLoading() {
    this.getElement().classList.remove('loading');
  }

  public dismissSystemMessage() {
    var desktop = document.getElementById('desktop');
    desktop.classList.toggle('blur');
    document.getElementById('system-message-overlay').classList.toggle('hidden');
    document.querySelectorAll('.system-message').forEach(e => e.remove());
  }

  public openContextMenu(event, contextTemplate : string, idApp : number) {
    event.preventDefault();
    this.closeContextMenus();

    var desktop = this.getElement();
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

  public closeContextMenus() {
    document.querySelectorAll('.context-menu').forEach(e => e.remove());
  }

  public static horizontalGridColumns() {
    var windowWidth = window.innerWidth;
    return windowWidth / App.width;
  }

  public static verticalGridRows() {
    var windowHeight = window.innerHeight;
    return windowHeight / App.height; // insgesamt anzahl an grids
  }

}