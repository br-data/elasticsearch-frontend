document.addEventListener('DOMContentLoaded', changeIcon, false);

function changeIcon() {
  var $icon = document.querySelector('.icon-search');
  var $submit = document.querySelector('.submit');

  if ($icon) {
    $submit.addEventListener('click', function () {
      $icon.className = 'icon-spinner';
    }, false);
  }
}
