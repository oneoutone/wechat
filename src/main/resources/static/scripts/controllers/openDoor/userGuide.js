
(function() {
  angular
    .module('app')
    .controller('UserGuid', UserGuid);

  UserGuid.$inject = ['$scope', 'User'];

  function UserGuid ($scope, User) {
    var vm = $scope;
    vm.showLogin = false;

    if(!User.isAuthenticated()){
      vm.showLogin = true
    }
  }
})();
