import Turbolinks from "turbolinks"
import * as moment from "moment";

$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  }
});



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
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
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

  public async logOut() {
    await $.ajax({
      global: false,
      type: "DELETE",
      url: "/users/sign_out",
      dataType: 'html',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
      },
      success: function (html) {
        console.log("Good Bye!");
      }
    });

    window.location.href = "/"
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