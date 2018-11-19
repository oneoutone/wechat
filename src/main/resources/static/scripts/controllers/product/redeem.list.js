(function() {
    angular
        .module('app')
        .controller('RedeemListCtrl', RedeemListCtrl);

    RedeemListCtrl.$inject = ['$scope', '$stateParams','$state', '$location', 'SeUtil', '$window', 'httpService'];

    function RedeemListCtrl ($scope, $stateParams, $state, $location, SeUtil, $window, httpService) {
        var vm = $scope

        vm.app.ready(function(){
            httpService.getRedeemList(function(r){
                vm.redeemList = r
            }, function(err){
                console.log(err)
            })
        })

    }
})();
