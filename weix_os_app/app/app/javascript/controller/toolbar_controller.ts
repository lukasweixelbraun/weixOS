import Turbolinks from "turbolinks"
import * as moment from "moment";

export class Toolbar {

  private static instance : Toolbar;

  private constructor() {
    setInterval(this.getSystemTime, 2000);
  }

  public static getInstance() {
    if(this.instance == null) {
      this.instance = new Toolbar();
    } 
    
    return this.instance;
  }

  public searchApp(appName) {
    $.ajax({
      global: false,
      type: "post",
      url: "/my_apps/search",
      dataType: 'html',
      data: {
        searchText: appName
      },
      success: function (html) {
        var searchResult = document.getElementById('app-search-result');
        searchResult.innerHTML = html;
      }
    });
  }

  public getSystemTime() {
    var systemTime = document.getElementById('system-time');

    if(systemTime) {
      let now = moment().format('dd, DD. MMM HH:mm');
      systemTime.textContent = now;
    }
  }

  public logOut() {
    $.ajax({
      global: false,
      type: "DELETE",
      url: "/users/sign_out",
      dataType: 'html',
      success: function (html) {
        console.log("Good Bye!");
        Turbolinks.clearCache();
        Turbolinks.visit("http://localhost:3000/", { "action":"replace" });
      }
    });
  }

  public closeSystemMenu() {
    if(!document.getElementById('system-menu-box').classList.contains('hidden')) {
      document.getElementById('system-menu-box').classList.toggle('hidden');
    }
  }

  public openSystemMenu() {
    document.getElementById('system-menu-box').classList.toggle('hidden');
    document.getElementById('app-search-input').focus();
  }
}