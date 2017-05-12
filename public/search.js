document.addEventListener('DOMContentLoaded', changeIcon, false);

function changeIcon() {
  var $icon = document.querySelector('.icon-search');
  var $submitButton = document.querySelector('.submit');

  if ($icon) {
    $submitButton.addEventListener('click', function () {
      $icon.className = 'icon-spinner';
    }, false);
  }
}
