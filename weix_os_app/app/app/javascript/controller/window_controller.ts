import { Desktop } from "./desktop_controller"

export class AppWindow {

  private appId : number = 0;
  private template_name : string = "";
  private pos_x : number = 0;
  private pos_y : number = 0;
  private last_state : string = "";
  private is_open : boolean = false;

  private windowElement : HTMLElement = null;
  private titleBar : HTMLElement = null;

  private closeWindowCallback : () => void;

  constructor(id : number, template_name : string, pos_x : number, pos_y : number, last_state : string, is_open : boolean, closeWindowCallback : () => void) {
    this.appId = id;
    this.template_name = template_name;
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.last_state = last_state;
    this.is_open = is_open;

    this.closeWindowCallback = closeWindowCallback;
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

  public getButton(method : string) {
    return this.getElement().querySelector('.app-' + method);
  }


  public isOpen() {
    return this.is_open;
  }

  public async open(event) {
    var windowElement : HTMLElement;
    var button_close : HTMLElement;
    var button_full : HTMLElement;
    var button_hide : HTMLElement;
    
    await $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/open_window",
      dataType: 'html',
      data: {
        id: this.appId,
        template_name: this.template_name,
        window_pos_x: this.pos_x,
        window_pos_y: this.pos_y,
        last_state: this.last_state
      },
      success: function (html) {
        var window_container = document.createElement('div');
        window_container.innerHTML = html;

        windowElement = window_container.firstChild as HTMLElement;
        Desktop.getInstance().getElement().appendChild(windowElement);
      }
    });

    this.windowElement = windowElement;
    this.titleBar = windowElement.querySelector('.app-title-bar');
    button_close = windowElement.querySelector('.app-close');
    button_full = windowElement.querySelector('.app-fullscreen');
    button_hide = windowElement.querySelector('.app-hide');

    if(this.windowElement != undefined) {
      this.enableDrag(event);
    }

    if(this.titleBar != undefined) {
      this.titleBar.addEventListener('dblclick', () => {
        this.fullscreen();
      }, false);
    }

    if(button_close != undefined) {
      button_close.addEventListener('click', () => {
        this.close();
      }, false);
    }

    if(button_full != undefined) {
      button_full.addEventListener('click', () => {
        this.fullscreen();
      }, false);
    }

    if(button_hide != undefined) {
      button_hide.addEventListener('click', () => {
        this.hide();
      }, false);
    }
  }

  public hide() {
    this.getElement().classList.toggle('hidden');
    this.saveState(this.getElement(), this.appId);
  }

  public fullscreen() {
    this.getElement().classList.toggle('fullscreen');
    this.saveState(this.getElement(), this.appId);
  }

  public async close() {
    $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/close_window",
      dataType: 'json',
      data: {
        id: this.appId
      }
    });

    this.getElement().remove();
    this.closeWindowCallback();
  }

  public saveState(element, app_id) {
    var window_state = element.classList.toString();
    window_state = window_state.replace(",", " ");
    window_state = window_state.replace("app-window", "");
    window_state = window_state.replace("window", "");
  
    $.ajax({
      global: false,
      type: "POST",
      url: "/my_apps/save_window_state",
      dataType: 'json',
      data: {
        id: app_id,
        last_state: window_state
      }
    });
  }

  private enableDrag(event) {
    var appId = this.appId;
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var title_bar = this.getTitleBar();
    var element = this.getElement();
    var saveState = this.saveState;
  
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
      if((element.offsetTop - (element.offsetHeight / 2) - pos2) >= 0) {
        this.pos_x = (element.offsetTop - pos2);
      } else {
        this.pos_x = (element.offsetHeight / 2);
      }
  
      this.pos_y = (element.offsetLeft - pos1);

      element.style.left = this.pos_y + "px";
      element.style.top = this.pos_x + "px";
      
  
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
        element.classList.add('fullscreen');
      } else if(direction != 'no tiling') {
        element.classList.add('tiling-' + direction);
      } else {
        //remove fullscreen if enabled
        if(element.classList.contains('fullscreen')) {
          element.classList.remove('fullscreen');

          element.style.top = (((element.offsetHeight + 25) / 2) - pos4) + "px";
          element.style.left = pos3 + "px";
        } else {
          element.classList.remove('tiling-left');
          element.classList.remove('tiling-right');
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

      if(element.style.left.includes("px")) {
        left = +element.style.left.replace("px", "");
        left = left / window.innerWidth * 100;
      } else if(element.style.left.includes("%")) {
        left = +element.style.left.replace("%", "");
      }

      if(element.style.top.includes("px")) {
        top = +element.style.top.replace("px", "");
        top = top / window.innerHeight * 100;
      } else if(element.style.top.includes("%")) {
        top = +element.style.top.replace("%", "");
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

      saveState(element, appId);
    }
  }
}