import { Desktop } from "./desktop_controller"
import { AppWindow } from "./window_controller"

export class App {

  private id : number = 0;
  private pos_x : number = 0;
  private pos_y : number = 0;
  private name : string = "";
  private img_src : string = "";

  private window : AppWindow = null;

  public static width = 140;
  public static height = 130;

  constructor(id : number, pos_x : number, pos_y : number, name : string, img_src : string) {
    this.id = id;
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.name = name;
    this.img_src = img_src;
  }

  public getId() {
    return this.id;
  }

  public openWindow(event, pos_x : number, pos_y : number, last_state : string) {
    this.window = new AppWindow(this.id, pos_x, pos_y, last_state);
    this.window.open(event);
    this.addToToolbar();
  }

  public closeWindow() {
    this.window.close();
    this.removeFromToolbar();
  }

  public hideWindow() {
    this.window.hide();
  }

  public fullscreenWindow() {
    this.window.fullscreen();
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
    app.style.top = top + "%";

    $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/update_pos",
      dataType: 'json',
      data: {
          id: this.id,
          pos_x: this.pos_y,
          pos_y: this.pos_y
      }
    });
  }

  public addToToolbar() {
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

    element.addEventListener('click', () => { 
      this.window.hide(); 
    }, false );

    element.addEventListener('contextmenu', (event) => { 
      Desktop.getInstance().openContextMenu(event, 'toolbar_app', this.id); 
    }, false );

    toolbar.appendChild(element);
  }

  public removeFromToolbar() {
    this.getToolbarElement().remove();
  }

  public addToDesktop() {
    $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/add_app_to_desktop",
      dataType: 'html',
      data: {
        id: this.id
      },
      success: function (html) {
        var app = document.createElement('div');
        app.innerHTML = html;
        Desktop.getInstance().getElement().appendChild(app.firstChild);
      }
    });
  }

  public removeFromDesktop() {
    $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/remove_app_to_desktop",
      dataType: 'json',
      data: {
        id: this.id
      },
      success: function (data) {
        this.getElement().remove();
      }
    });
  }
}