var modal = (function () {

  'use strict';

  function init() {

    // Find all modals
    var $modals = document.getElementsByClassName('modal');

    if ($modals) {

      // Bind event listeners to modals
      for (var i = 0; i < $modals.length; i++) {

        bind($modals[i]);
      }
    }
  }

  function bind($element) {

    var $wrapper = $element;
    var $close = $wrapper.querySelector('.close');

    $close.addEventListener('click', function () {

      close($wrapper);
    });

    $wrapper.addEventListener('click', function (e) {

      if (e.target == this) {

        close($wrapper);
      }
    });
  }

  function close($element) {

    document.body.style.overflow = 'visible';

    $element.style.opacity = '0';
    $element.style.pointerEvents = 'none';
  }

  function open($element) {

    document.body.style.overflow = 'hidden';

    $element.style.opacity = '1';
    $element.style.pointerEvents = 'auto';
  }

  // Export global functions
  return {
    init: init,
    bind: bind,
    close: close,
    open: open
  };
})();
