(function() {
    'use strict';
    angular
        .module('app')
        .config(function(toastrConfig) {
            angular.extend(toastrConfig,
                {positionClass: 'toast-top-full-width',
                    preventOpenDuplicates: true,
                    timeOut: 2000
                });
        })
        .controller('RedeemInfoCtrl', RedeemInfoCtrl);

    RedeemInfoCtrl.$inject = ['$scope', '$state', '$timeout', '$stateParams', 'toastr', 'httpService'];

    function RedeemInfoCtrl($scope, $state, $timeout, $stateParams, toastr, httpService){
        var vm = $scope
        vm.redeem = {}
        vm.product = {}
        vm.app.ready(function(){
            if($stateParams.id){
                httpService.getRedeem($stateParams.id, function(data){
                    vm.redeem = data
                    httpService.getProduct(data.productId, function(p){
                        vm.product = p
                    }, function(err){
                        console.log(err)
                    })
                }, function(err){
                    console.log(err)
                })
            }
        })
    }
})();
