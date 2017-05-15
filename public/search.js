document.addEventListener('DOMContentLoaded', changeIcon, false);

function changeIcon() {
  var $loadingIcon = document.querySelector('.loading');
  var $submitButton = document.querySelector('.submit');

  if ($loadingIcon) {
    $submitButton.addEventListener('click', function () {
      $loadingIcon.className = 'icon-spinner';
    }, false);
  }
}
