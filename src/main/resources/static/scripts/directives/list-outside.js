/**
 * Created by lzh on 06/02/2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .directive("listOutside", listOutside);
  listOutside.$inject = ['$window', '$timeout'];
  function listOutside($window,$timeout) {
    var directive = {
      restrict: 'A',
      link: link
    };
    return directive;
    function link(scope, elem, attrs) {
      var $md_list_outside_wrapper = $(elem),
        w = angular.element($window);

      function md_list_outside_height() {
        var content_height = w.height() - ((48 * 2) + 58);
        $md_list_outside_wrapper.height(content_height);
        $('#billList').height(content_height-49);
      }

      md_list_outside_height();

      w.on('resize', function(e) {
        // Reset timeout
        $timeout.cancel(scope.resizingTimer);
        // Add a timeout to not call the resizing function every pixel
        scope.resizingTimer = $timeout( function() {
          md_list_outside_height();
          return scope.$apply();
        }, 280);
      });

    }
  }
})();
