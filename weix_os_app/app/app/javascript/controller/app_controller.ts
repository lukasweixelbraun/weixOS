import { Desktop } from "./desktop_controller"
import { AppWindow } from "./window_controller"

$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  }
});

export class App {

  private id : number = 0;
  private pos_x : number = 0;
  private pos_y : number = 0;
  private name : string = "";
  private template_name : string = "";
  private img_src : string = "";
  private desktop_link : boolean = false;
  private toolbar_link : boolean = false;

  private closeWindowCallback : () => void;

  private window : AppWindow = null;

  public static width = 140;
  public static height = 130;

  constructor(id : number, pos_x : number, pos_y : number, name : string, template_name : string, img_src : string, desktop_link : boolean, toolbar_link : boolean) {
    this.id = id;
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.name = name;
    this.template_name = template_name;
    this.img_src = img_src;
    this.desktop_link = desktop_link;
    this.toolbar_link = toolbar_link;

    this.closeWindowCallback = () => {
      if(this.hasToolbarLink() == false) {
        this.removeFromToolbar();
      }
  
      this.window = null;
    }
  }

  public getCloseWindowCallback() {
    return this.closeWindowCallback;
  }

  public setWindow(window) {
    this.window = window;
  }

  public hasDesktopLink() {
    return this.desktop_link;
  }

  public hasToolbarLink() {
    return this.toolbar_link;
  }

  public getId() {
    return this.id;
  }

  public openWindow(event) {
    if(this.window == null || this.window == undefined) {
      this.window = new AppWindow(this.id, this.template_name, 50, 50, "", false, this.closeWindowCallback);
    }

    if(this.window.isOpen() == true) {
      return;
    }
    
    this.window.open(event);
    this.addToToolbar();
  }

  public getElement() {
    return document.getElementById('app-' + this.id);
  }

  public getToolbarElement() {
    return document.getElementById('element-app-id-' + this.id);
  }

  public move(x, y) {
    var app = this.getElement();

    var horizontalGridColumns = Desktop.horizontalGridColumns();
    var verticalGridRows = Desktop.verticalGridRows();

    var gridX = Math.ceil(x / App.width); // dropped into gridX
    var gridY = Math.ceil(y / App.height); // dropped into gridY
  
    var leftTotal = gridX / horizontalGridColumns * 100; // left: %
    var topTotal = gridY / verticalGridRows * 100; // top: %

    // transform -50%
    this.pos_x = leftTotal - (App.width / window.innerWidth * 100);
    this.pos_y = topTotal - (App.height / window.innerHeight * 100);

    if((window.innerWidth / 100 * this.pos_x + App.width) > window.innerWidth) {
      x -= App.width;
      gridX = Math.ceil(x / App.width); // dropped into gridX
      leftTotal = gridX / horizontalGridColumns * 100; // left: %
      this.pos_x = leftTotal - (App.width / window.innerWidth * 100);
    }

    if((window.innerHeight / 100 * this.pos_y + App.height) > window.innerHeight) {
      y -= App.height;
      gridY = Math.ceil(y / App.height); // dropped into gridY
      topTotal = gridY / verticalGridRows * 100; // top: %
      this.pos_y = topTotal - (App.height / window.innerHeight * 100);
    }

    app.style.left = this.pos_x + "%";
    app.style.top = this.pos_y + "%";

    $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/update_pos",
      dataType: 'json',
      data: {
          id: this.id,
          pos_x: this.pos_x,
          pos_y: this.pos_y
      }
    });
  }

  public addToToolbar() {
    if(this.getToolbarElement() != undefined) {
      return;
    }

    var toolbar = document.getElementById('pinned-applications');

    var element = document.createElement('div');
    element.classList.add('element');
    element.setAttribute('id', ('element-app-id-' + this.id));

    var app = document.createElement('div');
    app.classList.add('app');

    var app_icon = document.createElement('img');
    app_icon.classList.add('icon');
    app_icon.setAttribute('src', this.img_src);
    app.appendChild(app_icon);

    element.appendChild(app);

    element.addEventListener('click', (event) => { 
      if(this.window == null) {
        this.openWindow(event);
      } else {
        this.window.hide(); 
      }
    }, false );

    element.addEventListener('contextmenu', (event) => { 
      Desktop.getInstance().openContextMenu(event, 'toolbar_app', this.id); 
    }, false );

    toolbar.appendChild(element);
  }

  public async addToFavorites() {
    await $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/add_app_to_favorites",
      dataType: 'html',
      data: {
        id: this.id
      },
      success: function (html) {
        // Nix
      }
    });

    this.toolbar_link = true;

    if(this.getToolbarElement() == undefined) {
      this.addToToolbar();
    }
  }

  public async removeFromFavorites() {
    await $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/remove_app_from_favorites",
      dataType: 'html',
      data: {
        id: this.id
      },
      success: function (html) {
        // Nix
      }
    });

    this.toolbar_link = false;

    if(this.getToolbarElement() != undefined && (this.window == null || this.window?.isOpen() == false)) {
      this.removeFromToolbar();
    }
  }

  public removeFromToolbar() {
    this.getToolbarElement().remove();
  }

  public async addToDesktop() {
    var app : ChildNode;

    await $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/add_app_to_desktop",
      dataType: 'html',
      data: {
        id: this.id
      },
      success: function (html) {
        var app_container = document.createElement('div');
        app_container.innerHTML = html;
        app = app_container.firstChild;
        Desktop.getInstance().getElement().appendChild(app);
      }
    });

    if(app != null) {
      //append Listener
      app.addEventListener('dblclick', (event) => {
        this.openWindow(event);
      }, false);

      app.addEventListener('contextmenu', (event) => {
        Desktop.getInstance().openContextMenu(event, 'desktop_app', this.id);
      }, false);

      app.addEventListener('dragstart', (event : any) => {
        var dragElement = event.target.closest('div').id;
        var dragAppId : number = dragElement.replace("app-", "");
        Desktop.getInstance().setDragApp(dragAppId);
      }, false);

      this.desktop_link = true;
    }
  }

  public async removeFromDesktop() {
    await $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/remove_app_from_desktop",
      dataType: 'json',
      data: {
        id: this.id
      },
      success: function (data) {

      }
    });

    this.desktop_link = false;

    this.getElement().remove();
  }
}