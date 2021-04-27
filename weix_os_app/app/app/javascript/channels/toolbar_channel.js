import moment from "moment"

var typingTimer = void 0;
var doneTypingInterval = 300;

window.appSearchEvent = function(e) {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(searchApp, doneTypingInterval, e.target.value);
  return;
};

function searchApp(appName) {
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

// --- Date Time for System Time ---

window.getSystemTime = function() {
  var systemTime = document.getElementById('system-time');

  if(systemTime) {
    let now = moment().format('dd, DD. MMM HH:mm');
    systemTime.textContent = now;
  }
}

setInterval(getSystemTime, 2000);

window.logOut = function() {
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

window.openSystemMenu = function(e) {
  e.preventDefault();
  document.getElementById('system-menu-box').classList.toggle('hidden');
  document.getElementById('app-search-input').focus();
  e.stopPropagation();
}