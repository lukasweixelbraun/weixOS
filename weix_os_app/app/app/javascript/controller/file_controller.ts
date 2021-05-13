$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
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

  public async chdir() {
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

  public download() {
    $.ajax({
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
  }
}