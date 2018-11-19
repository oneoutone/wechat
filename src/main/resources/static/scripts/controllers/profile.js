(function() {
  angular
    .module('app')
    .config(function(toastrConfig) {
      angular.extend(toastrConfig, {
        positionClass: 'toast-top-full-width',
        preventOpenDuplicates: true,
        timeOut: 1000,
      });
    })
    .controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['$scope',  '$state', 'toastr', '$location', '$stateParams', '$element', '$http', '$window', 'SeUtil'];

  function ProfileCtrl ($scope, $state, toastr, $location, $stateParams, $element, $http, $window, SeUtil) {
      var vm =$scope
      if (!vm.app.isAuthenticated()) {
          var url = $location.path();
          var from = encodeURIComponent(url);
          $location.path('/signin').search('state=' + from);
      }
  }
})();
