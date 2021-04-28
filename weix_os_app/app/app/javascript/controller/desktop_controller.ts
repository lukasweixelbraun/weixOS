import { App } from "./app_controller"

export class Desktop {

  private desktopElement : HTMLElement = null;
  private static instance : Desktop;
  private apps : App[] = [];

  private constructor() {

  }

  public appendApp(id : number, pos_x : number, pos_y : number, name : string, img_src : string) {
    this.apps.push(new App(id, pos_x, pos_y, name, img_src));
  }

  public getApp(id : number) {
    var app : App = this.apps.find((a : App) => a.getId() == id);
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

  public createSystemMessage(type : string, title : string, message : string, inputs : any) {
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

  public dismissSystemMessage() {
    document.getElementById('system-message-overlay').classList.toggle('hidden');
    document.querySelectorAll('.system-message').forEach(e => e.remove());
  }

  public openContextMenu(event, contextTemplate : string, idApp : number) {
    event.preventDefault();
    this.closeContextMenus();

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
        var desktop = this.getElement();

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