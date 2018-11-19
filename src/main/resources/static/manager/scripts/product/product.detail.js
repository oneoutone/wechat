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
        .controller('ProductDetailCtrl', ProductDetailCtrl);

    ProductDetailCtrl.$inject = ['$scope', '$state', '$timeout', '$stateParams', 'toastr', 'httpService'];

    function ProductDetailCtrl($scope, $state, $timeout, $stateParams, toastr, httpService){
        var vm = $scope
        vm.pass=true
        vm.refuse=false
        vm.product = {}

        vm.app.ready(function(){
            if($stateParams.id){
                httpService.getProduct($stateParams.id, function(data){
                    vm.product = data
                    if(vm.product.detailImageUrl){
                        vm.detailImages = vm.product.detailImageUrl.split(',')
                        console.log(vm.detailImages)
                    }
                }, function(err){
                    console.log(err)
                })
            }
        })
    }
})();
