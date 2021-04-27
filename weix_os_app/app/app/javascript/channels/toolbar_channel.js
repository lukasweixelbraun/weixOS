import moment from "moment"

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
      Turbolinks.clearCache()
      Turbolinks.visit("http://localhost:3000/", {"action":"replace"})
      
    }
  });
}

window.openSystemMenue = function(e) {
  e.preventDefault();
  document.getElementById('system-menue-box').classList.toggle('hidden');
  e.stopPropagation();
}