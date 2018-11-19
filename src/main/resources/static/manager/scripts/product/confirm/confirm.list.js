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
        .controller('ConfirmListCtrl', ConfirmListCtrl);

    ConfirmListCtrl.$inject = ['$scope', '$state', '$timeout', 'toastr', 'httpService', '$stateParams'];

    function ConfirmListCtrl($scope, $state, $timeout, toastr, httpService, $stateParams){
        var vm = $scope;
        //草稿:draft; 待审核:confirm_waiting; 已审核:confirmed; 审核驳回: confirm_refused
        vm.statusList = [
            {name: '全部', value: 'all'},
            {name: '待审核', value: 'confirm_waiting'},
            {name: '已审核', value: 'confirmed'},
            {name: '审核驳回', value: 'confirm_refused'},
        ]

        vm.fetchData = function(){

            httpService.getProductList(vm.filter, function(data){
                vm.productList = data.productList
            }, function(err){
                console.log(err)
            })

            httpService.getProductCount(vm.filter, function(data){
                vm.bigTotalItems = data.count
                vm.bigCurrentPage = vm.filter.page
            }, function(err){
                console.log(err)
            })
        }

        vm.doFilter = function(){
            $state.go('app.confirm.list', {page: 1, id: vm.filter.id, name: vm.filter.name, status: vm.filter.status})
        }

        $scope.pageChanged = function() {
            if(vm.bigCurrentPage == vm.filter.index){
                return
            }
            $state.go('app.confirm.list', {page: vm.bigCurrentPage, id: vm.filter.id, name: vm.filter.name, status: vm.filter.status})
        };


        vm.app.ready(function(){
            //name&status&saleStatus&start&end
            vm.filter = {}
            if($stateParams.id){
                vm.filter.id = $stateParams.id
            }
            if($stateParams.name){
                vm.filter.name = $stateParams.name
            }
            if($stateParams.status){
                vm.filter.status = $stateParams.status
            }else{
                vm.filter.status = 'confirm_waiting'
            }
            if($stateParams.page){
                vm.filter.page = $stateParams.page
            }else{
                vm.filter.page = 1
            }
            vm.fetchData()
        })
    }
})();
