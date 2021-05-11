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
    setInterval(this.getSystemInfo, 3000);
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

  public async getSystemInfo() {
    // icons
    var cpu_element = document.getElementById('cpu_element');
    var temp_element = document.getElementById('temp_element');
    var memory_element = document.getElementById('memory_element');
    var upgradable_element = document.getElementById('upgradable_element');

    // progress
    var cpu_element_prog = document.getElementById('cpu_progress') as HTMLProgressElement;
    var temp_element_prog = document.getElementById('temp_progress') as HTMLProgressElement;
    var memory_element_prog = document.getElementById('memory_progress') as HTMLProgressElement;
    var swap_element_prog = document.getElementById('swap_progress') as HTMLProgressElement;

    var cpu;
    var temp;
    var memory;
    var swap;
    var upgradable;

    await $.ajax({
      global: false,
      type: "GET",
      url: "/system/fetch_system_info",
      dataType: 'json',
      success: function (data) {
        cpu = data['cpu'];
        temp = data['temp'];
        memory = data['memory'];
        swap = data['swap'];
        upgradable = data['upgradables'];
      }
    });

    if(cpu != undefined && cpu != null) {
      cpu_element.title = 'System CPU: ' + cpu + ' %';
      cpu_element_prog.value = cpu;
      cpu_element_prog.innerHTML = cpu + ' %';
    }
    if(temp != undefined && temp != null) {
      temp_element.title = 'Temperature: ' + temp + ' C';
      temp_element_prog.value = temp;
      temp_element_prog.innerHTML = temp + ' C';
    }
    if (memory != undefined && memory != null && swap != undefined && swap != null) {
      memory_element.title = 'Memory usage: ' + memory + ' %  Swap usage: ' + swap + ' %';
      memory_element_prog.value = memory;
      memory_element_prog.innerHTML = memory + ' %';
      swap_element_prog.value = swap;
      swap_element_prog.innerHTML = swap + ' %';
    }
    if(upgradable != undefined && upgradable != null) {
      upgradable_element.title = 'Upgradable Packages: ' + upgradable + '';
    }
    
  }

  public cloesDetailedSystemInfo() {
    var sysInfo = document.getElementById('detailed-system-info');
    if(!sysInfo.classList.contains('hidden')) {
      sysInfo.classList.add('hidden');
    }
  }

  public toggleDetailedSystemInfo() {
    var sysInfo = document.getElementById('detailed-system-info');
    sysInfo.classList.toggle('hidden');
  }

  public async logOut() {
    await $.ajax({
      global: false,
      type: "DELETE",
      url: "/users/sign_out",
      dataType: 'html',
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