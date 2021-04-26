import moment from "moment"

// --- Date Time for System Time ---

window.getSystemTime = function() {
  let now = moment().format('dd, DD. MMM HH:mm');
  document.getElementById('system-time').textContent = now;
}

setInterval(getSystemTime, 2000);