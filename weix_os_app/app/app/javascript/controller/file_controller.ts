import { Desktop } from "./desktop_controller"

$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  },
  statusCode: {
    500: function(err){
      Desktop.getInstance().stopLoading();
    }
  }
});

export class File {

  private name : string;
  private path : string;
  private type : string;

  constructor(name : string, path : string, type : string) {
    this.name = name;
    this.path = path;
    this.type = type;
  }

  public async move(dir: File) {
    Desktop.getInstance().showLoading();

    await $.ajax({
      global: false,
      type: "POST",
      url: "/file_system/move",
      data: {
        file_path: this.path,
        dir_path: dir.path
      },
      dataType: 'html',
      success: function(html) {
        var file_table = document.getElementById('system-files');
        file_table.innerHTML = html;
      }
    });

    Desktop.getInstance().stopLoading();
  }

  public async chdir() {
    Desktop.getInstance().showLoading();

    await $.ajax({
      global: false,
      type: "POST",
      url: "/file_system/chdir",
      data: {
        path: this.path
      },
      dataType: 'html',
      success: function(html) {
        var file_table = document.getElementById('system-files');
        file_table.innerHTML = html;
      }
    });

    this.updateNavBar();

    Desktop.getInstance().stopLoading();
  }

  public async delete() {
    Desktop.getInstance().showLoading();

    await $.ajax({
      global: false,
      type: "DELETE",
      url: "/file_system/delete",
      data: {
        name: this.name
      },
      success: function (html) {
        var file_table = document.getElementById('system-files');
        file_table.innerHTML = html;
      }
    });

    Desktop.getInstance().stopLoading();
  }

  public updateNavBar() {
    $.ajax({
      global: false,
      type: "POST",
      url: "/file_system/update_nav",
      dataType: 'html',
      success: function(html) {
        var file_nav = document.getElementById('file-navigation-container');
        file_nav.innerHTML = html;
      }
    });
  }

  public openContextMenu(event, contextTemplate : string) {
    event.preventDefault();
    this.closeContextMenus();

    var desktop = document.getElementById('desktop');
    var x = event.clientX;
    var y = event.clientY;

    $.ajax({
      global: false,
      type: "POST",
      url: "/file_system/open_context_menu",
      dataType: 'html',
      data: {
        name: this.name,
        path: this.path,
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

  public async download() {
    Desktop.getInstance().showLoading();

    await $.ajax({
      global: false,
      type: "POST",
      url: "/file_system/download",
      data: {
        name: this.name
      },
      xhrFields: {
        responseType: 'blob' // to avoid binary data being mangled on charset conversion
      },
      success: function(blob, status, xhr) {
        // check for a filename
        var filename = "";
        var disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
        }

        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
          window.navigator.msSaveBlob(blob, filename);
        } else {
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);

          if (filename) {
            // use HTML5 a[download] attribute to specify filename
            var a = document.createElement("a");
            // safari doesn't support this yet
            if (typeof a.download === 'undefined') {
              window.location.href = downloadUrl;
            } else {
              a.href = downloadUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
            }
          } else {
            window.location.href = downloadUrl;
          }

          setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
        }
      }
    });

    Desktop.getInstance().stopLoading();
  }
}