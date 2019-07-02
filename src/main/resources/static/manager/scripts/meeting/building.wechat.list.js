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
        .controller('WechatBuildingCtrl', WechatBuildingCtrl);
    WechatBuildingCtrl.$inject = ['$scope', '$location', '$filter', '$element', '$state', '$stateParams', '$window', 'toastr', '$timeout', 'httpService'];

    function WechatBuildingCtrl($scope, $location, $filter, $element, $state, $stateParams, $window, toastr, $timeout, httpService) {

        var vm = $scope
        httpService.getBuildingList(function(result){
            vm.buildings = result
        })
    }
})();
