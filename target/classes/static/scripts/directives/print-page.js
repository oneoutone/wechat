(function() {
  'use strict';
  angular
    .module('app')
    .directive("printPage", printPage);
  printPage.$inject = ['$rootScope', '$timeout'];
  function printPage($rootScope, $timeout) {
    var directive = {
      restrict: 'A',
      link: link
    };
    return directive;
    function link(scope, elem, attrs) {
      var message = attrs['printMessage'];
      $(elem).on('click', function(e) {
        e.preventDefault();
        UIkit.modal.confirm(message ? message : '要打印当前合同吗', function () {
          // hide sidebar
          $rootScope.primarySidebarActive = false;
          $rootScope.primarySidebarOpen = false;
          // wait for dialog to fully hide
          $timeout(function () {
            window.print();
          }, 300)
        }, {
          labels: {
            'Ok': '打印',
            'Cancel': '取消'
          }
        });
      });
    }
  }
})();
