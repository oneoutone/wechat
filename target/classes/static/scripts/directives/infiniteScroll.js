/**
 * Created by lzh on 15/03/2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .directive('infiniteScroll', infiniteScroll);
  infiniteScroll.$inject = ['$rootScope', '$window', '$timeout'];
  function infiniteScroll($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
        $window = angular.element($('#test'));
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        console.info("sdsfbbf", scrollDistance);
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        handler = function() {
          var elementBottom, remaining, shouldScroll, windowBottom;
          windowBottom = $('#test').scrollTop();
          elementBottom = $('#test')[0].scrollHeight;
          console.info("windowBottom", windowBottom);
          console.info("elementBottom", elementBottom);
          console.info("elementBottom", $('#test'));
          remaining = elementBottom - windowBottom - $('#test').height();
          console.info("remaining", remaining);
          shouldScroll = remaining <= 0;
          if (shouldScroll && scrollEnabled) {
            if ($rootScope.$$phase) {
              return scope.$eval(attrs.infiniteScroll);
            } else {
              return scope.$apply(attrs.infiniteScroll);
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        $window.on('scroll', handler);
        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
        return $timeout((function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }), 0);
      }
    };
  }
})();
