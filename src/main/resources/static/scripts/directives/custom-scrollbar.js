/**
 * Created by lzh on 06/02/2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .directive("customScrollbar", customScrollbar);
  customScrollbar.$inject = ['$rootScope', '$timeout'];
  function customScrollbar($rootScope, $timeout) {
    var directive = {
      restrict: 'A',
      scope: true,
      link: link
    };
    return directive;
    function link(scope, el, attrs) {

      // check if mini sidebar is enabled
      if(attrs['id'] == 'sidebar_main' && $rootScope.miniSidebarActive) {
        return;
      }

      $(el)
        .addClass('uk-height-1-1')
        .wrapInner("<div class='scrollbar-inner'></div>");
      //console.info("sderree");
      //$timeout(function() {
      //  $(el).children('.scrollbar-inner').scrollbar({
      //    disableBodyScroll: true,
      //    scrollx: false,
      //    duration: 100
      //  });
      //});
      //}

    }
  }
})();
