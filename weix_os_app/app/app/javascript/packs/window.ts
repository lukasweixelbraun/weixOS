class AppWindow {

  private appId : number = 0;
  private pos_x : number = 0;
  private pos_y : number = 0;
  private last_state : string = "";

  private windowElement : HTMLElement = null;
  private titleBar : HTMLElement = null;


  constructor(id : number, pos_x : number, pos_y : number, last_state : string) {
    this.appId = id;
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.last_state = last_state;
  }

  public getElement() {
    if(this.windowElement == null) {
      this.windowElement = document.getElementById('app-window-id-' + this.appId);
    }

    return this.windowElement;
  }

  public getTitleBar() {
    if(this.titleBar == null) {
      this.titleBar = this.getElement().querySelector('.app-title-bar');
    }
    
    return this.titleBar;
  }

  public open(event) {
    $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/open_window",
      dataType: 'html',
      data: {
        id: this.appId,
        window_pos_x: this.pos_x,
        window_pos_y: this.pos_y,
        last_state: this.last_state
      },
      success: function (html) {
        var app = document.createElement('div');
        app.innerHTML = html;
  
        while(app.firstChild) {
          Desktop.getInstance().getElement().appendChild(app.firstChild);
        }
      }
    });

    this.enableDrag(event);
  }

  public hide() {
    this.getElement().classList.toggle('hidden');
    this.saveState();
  }

  public fullscreen() {
    this.getElement().classList.toggle('fullscreen');
    this.saveState();
  }

  public close() {
    $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/close_window",
      dataType: 'json',
      data: {
        id: this.appId
      },
      success: function (data) {
        this.getElement().remove();
      }
    });
  }

  public saveState() {
    var window_state = this.getElement().classList.toString();
    window_state = window_state.replace(",", " ");
    window_state = window_state.replace("app-window", "");
    window_state = window_state.replace("window", "");
  
    $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/save_window_state",
      dataType: 'json',
      data: {
        id: this.appId,
        last_state: window_state
      }
    });
  }

  private enableDrag(event) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var title_bar = this.getTitleBar();
  
    if (title_bar != null) {
      // if present, the header is where you move the DIV from:
      title_bar.onmousedown = dragMouseDown;
    } else {
      // otherwise - dont move the div
      event.preventDefault();
      return;
    }
  
    function dragMouseDown(event) {
      Desktop.getInstance().getElement().style.cursor = "move"; 
  
      event = event || window.event;
      event.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = event.clientX;
      pos4 = event.clientY;
  
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(event) {
      event = event || window.event;
      event.preventDefault();
      
      // calculate the new cursor position:
      pos1 = pos3 - event.clientX;
      pos2 = pos4 - event.clientY;
      pos3 = event.clientX;
      pos4 = event.clientY;
  
      // set the element's new position:
      if((this.getElement().offsetTop - (this.getElement().offsetHeight / 2) - pos2) >= 0) {
        this.pos_x = (this.getElement().offsetTop - pos2);
      } else {
        this.pos_x = (this.getElement().offsetHeight / 2);
      }
  
      this.pos_y = (this.getElement().offsetLeft - pos1);

      this.getElement().style.left = this.pos_y + "px";
      this.getElement().style.top = this.pos_x + "px";
      
  
      // check tiling
      if(event.clientY <= 15) {
        tiling('top');
      } else if(event.clientX <= 50) {
        tiling('left');
      } else if(event.clientX >= window.innerWidth - 50) {
        tiling('right');
      } else {
        tiling('no tiling');
      }
    }

    function tiling(direction) {
      if(direction == 'top') {
        this.getElement().classList.add('fullscreen');
      } else if(direction != 'no tiling') {
        this.getElement().classList.add('tiling-' + direction);
      } else {
        //remove fullscreen if enabled
        if(this.getElement().classList.contains('fullscreen')) {
          this.getElement().classList.remove('fullscreen');

          this.getElement().style.top = (((this.getElement().offsetHeight + 25) / 2) - pos4) + "px";
          this.getElement().style.left = pos3 + "px";
        } else {
          this.getElement().classList.remove('tiling-left');
          this.getElement().classList.remove('tiling-right');
        }
      }
    }

    function closeDragElement() {
      Desktop.getInstance().getElement().style.cursor = "default";

      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;

      var left = 50;
      var top = 50;

      if(this.getElement().style.left.includes("px")) {
        left = this.getElement().style.left.replace("px", "");
        left = left / window.innerWidth * 100;
      } else if(this.getElement().style.left.includes("%")) {
        left = this.getElement().style.left.replace("%", "");
      }

      if(this.getElement().style.top.includes("px")) {
        top = this.getElement().style.top.replace("px", "");
        top = top / window.innerHeight * 100;
      } else if(this.getElement().style.top.includes("%")) {
        top = this.getElement().style.top.replace("%", "");
      }

      $.ajax({
        global: false,
        type: "POST",
        url: "/my_apps/update_window_pos",
        dataType: 'json',
        data: {
          id: this.appId,
          window_pos_x: left,
          window_pos_y: top
        }
      });

      this.saveState();
    }
  }
}

// ------------------------------ WINDOW EVENTS ------------------------------

function openNewWindow(event, id : number) {
  event.preventDefault();
  var app = Desktop.getInstance().getApp(id);
  app.openWindow(event, 50, 50, "");
}

function openWindow(event, appId : number, pos_x : number, pos_y : number, last_state : string) {
  event.preventDefault();
  var app = Desktop.getInstance().getApp(appId);
  app.openWindow(event, pos_x, pos_y, last_state);
}

function closeWindow(id : number) {
  var app = Desktop.getInstance().getApp(id);
  app.closeWindow();
}

function hideWindow(id : number) {
  var app = Desktop.getInstance().getApp(id);
  app.hideWindow();
}

function fullscreenWindow(id : number) {
  var app = Desktop.getInstance().getApp(id);
  app.fullscreenWindow();
}