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
        .controller('ConfirmInfoCtrl', ConfirmInfoCtrl);

    ConfirmInfoCtrl.$inject = ['$scope', '$state', '$timeout', '$stateParams', 'toastr', 'httpService'];

    function ConfirmInfoCtrl($scope, $state, $timeout, $stateParams, toastr, httpService){
        var vm = $scope
        vm.pass=true
        vm.refuse=false
        vm.product = {}

        vm.changePass = function(){
            vm.refuse = !vm.pass
        }

        vm.changeRefuse = function(){
            vm.pass = !vm.refuse
        }

        vm.confirm = function(){
            var s = 'confirmed'
            if(vm.refuse == true){
                s = 'confirm_refused'
            }
            httpService.batchUpdateProduct({ids: vm.product.id, status: s}, function(data){
                toastr.success('审核成功')
                window.history.go(-1)
            }, function(err){
                console.log(err)
                toastr.error('审核失败')
            })
        }

        console.log($stateParams.id)
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
