window.closeSystemMenue = function(e) {
  e.preventDefault();
  var systemMenue = document.getElementById('system-menue-box');

  if(systemMenue.classList.contains('hidden') == false) {
    systemMenue.classList.add('hidden');
  }
}