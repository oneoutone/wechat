(function() {
  'use strict';
  angular
    .module('app')
    .directive("onFinishRenderFilters", onFinishRenderFilters);
  onFinishRenderFilters.$inject = ['$timeout'];
  function onFinishRenderFilters($timeout) {
    var directive = {
      restrict: 'A',
      link: link
    };
    return directive;
    function link(scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function() {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  }
})();

