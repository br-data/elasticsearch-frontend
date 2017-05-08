document.addEventListener('DOMContentLoaded', init, false);

function init() {
  var $loading = document.querySelector('.loading');
  var $submit = document.querySelector('.submit');

  $submit.addEventListener('click', function () {

    $loading.style.visibility = 'visible';
  }, false);
}
