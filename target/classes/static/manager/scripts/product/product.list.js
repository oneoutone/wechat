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
        .controller('ProductListCtrl', ProductListCtrl);

    ProductListCtrl.$inject = ['$scope', '$state', '$timeout', 'toastr', 'httpService', '$stateParams'];

    function ProductListCtrl($scope, $state, $timeout, toastr, httpService, $stateParams){
        var vm = $scope;
        //草稿:draft; 待审核:confirm_waiting; 已审核:confirmed; 审核驳回: confirm_refused
        vm.statusList = [
            {name: '全部', value: 'all'},
            {name: '草稿', value: 'draft'},
            {name: '待审核', value: 'confirm_waiting'},
            {name: '已审核', value: 'confirmed'},
            {name: '审核驳回', value: 'confirm_refused'},
        ]

        vm.saleStatusList = [
            {name: '全部', value: 'all'},
            {name: '上架', value: 'up'},
            {name: '下架', value: 'down'}
        ]

        vm.confirmDisabled = true
        vm.upDisabled = true
        vm.downDisabled = true
        vm.deleteDisabled = true
        vm.modifyDisabled = true

        vm.getStatus = function(status){
            var r = vm.status.filter(function(item){
                return item.value == status
            })
            return r[0].name
        }

        vm.fetchData = function(){

            if(vm.filter.start){
                vm.filter.start = moment(vm.filter.start ).format('YYYY-MM-DD HH:mm:ss')
            }
            if(vm.filter.end){
                vm.filter.end = moment(vm.filter.end ).format('YYYY-MM-DD HH:mm:ss')
            }
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
            $state.go('app.product.list', {page: 1, name: vm.filter.name, status: vm.filter.status, saleStatus: vm.filter.saleStatus, start: vm.filter.start, end: vm.filter.end})
        }

        $scope.pageChanged = function() {
            if(vm.bigCurrentPage == vm.filter.index){
                return
            }
            $state.go('app.product.list', {page: vm.bigCurrentPage, name: vm.filter.name, status: vm.filter.status, saleStatus: vm.filter.saleStatus, start: vm.filter.start, end: vm.filter.end})
        };

        vm.selectAll = function(){
            if(vm.allSelected){
                vm.productList.forEach(function(item){
                    item.selected = true
                })
            }else{
                vm.productList.forEach(function(item){
                    item.selected = false
                })
            }
            vm.selectChanged()
        }

        vm.goModify = function(){
            var list = vm.productList.filter(function(item){
                return item.selected == true
            })
            if(list.length == 1){
                $state.go('app.product.info', {id: list[0].id})
            }
        }

        vm.selectChanged = function(){
            var list = vm.productList.filter(function(item){
                return item.selected == true
            })

            if(!list || list.length == 0){
                vm.confirmDisabled = true
                vm.upDisabled = true
                vm.downDisabled = true
                vm.deleteDisabled = true
                vm.modifyDisabled = true
                return
            }

            vm.confirmDisabled = true
            var unDraftList = list.filter(function(item){
                return item.status != 'draft'
            })
            if(!unDraftList || unDraftList.length == 0){
                vm.confirmDisabled = false
            }

            vm.upDisabled = true
            var unUpList = list.filter(function(item){
                return item.status != 'confirmed' || item.saleStatus == 'up'
            })
            if(!unUpList || unUpList.length == 0){
                vm.upDisabled = false
            }

            vm.downDisabled = true
            var unDownList = list.filter(function(item){
                return item.status != 'confirmed' || item.saleStatus == 'down'
            })
            if(!unDownList || unDownList.length == 0){
                vm.downDisabled = false
            }
            vm.deleteDisabled = true
            if(list.length > 0){
                vm.deleteDisabled = false
            }

            vm.modifyDisabled = true
            if(list.length == 1){
                vm.modifyDisabled = false
            }
        }

        vm.confirm = function(){
            var list = vm.productList.filter(function(item){
                return item.selected == true
            })
            if(!list || list.length == 0){
                return
            }
            var productIds = list[0].id
            for(var i=1; i<list.length; i++){
                productIds += ','+list[i].id
            }
            httpService.batchUpdateProduct({ids: productIds, status: 'confirm_waiting'}, function(data){
                toastr.success('提交审核成功')
                $state.go('app.product.list', {page: vm.bigCurrentPage, name: vm.filter.name, status: vm.filter.status, saleStatus: vm.filter.saleStatus, start: vm.filter.start, end: vm.filter.end}, {reload: true})
            }, function(err){
                console.log(err)
            })
        }

        vm.up = function(){
            var list = vm.productList.filter(function(item){
                return item.selected == true
            })
            if(!list || list.length == 0){
                return
            }
            var productIds = list[0].id
            for(var i=1; i<list.length; i++){
                productIds += ','+list[i].id
            }
            httpService.batchUpdateProduct({ids: productIds, saleStatus: 'up'}, function(data){
                toastr.success('提交上架成功')
                $state.go('app.product.list', {page: vm.bigCurrentPage, name: vm.filter.name, status: vm.filter.status, saleStatus: vm.filter.saleStatus, start: vm.filter.start, end: vm.filter.end}, {reload: true})
            }, function(err){
                console.log(err)
            })
        }

        vm.down = function(){
            var list = vm.productList.filter(function(item){
                return item.selected == true
            })
            if(!list || list.length == 0){
                return
            }
            var productIds = list[0].id
            for(var i=1; i<list.length; i++){
                productIds += ','+list[i].id
            }
            httpService.batchUpdateProduct({ids: productIds, saleStatus: 'down'}, function(data){
                toastr.success('提交下架成功')
                $state.go('app.product.list', {page: vm.bigCurrentPage, name: vm.filter.name, status: vm.filter.status, saleStatus: vm.filter.saleStatus, start: vm.filter.start, end: vm.filter.end}, {reload: true})
            }, function(err){
                console.log(err)
            })
        }

        vm.showDeleteModal = function(){
            $('#delete').modal('show');
        }

        vm.delete = function(){
            var list = vm.productList.filter(function(item){
                return item.selected == true
            })
            if(!list || list.length == 0){
                return
            }
            var productIds = list[0].id
            for(var i=1; i<list.length; i++){
                productIds += ','+list[i].id
            }
            httpService.batchUpdateProduct({ids: productIds, deleted: true}, function(data){
                toastr.success('删除成功')
                $state.go('app.product.list', {page: vm.bigCurrentPage, name: vm.filter.name, status: vm.filter.status, saleStatus: vm.filter.saleStatus, start: vm.filter.start, end: vm.filter.end}, {reload: true})
            }, function(err){
                console.log(err)
            })
        }



        vm.app.ready(function(){
            //name&status&saleStatus&start&end
            vm.filter = {}
            if($stateParams.name){
                vm.filter.name = $stateParams.name
            }
            if($stateParams.status){
                vm.filter.status = $stateParams.status
            }else{
                vm.filter.status = 'all'
            }
            if($stateParams.saleStatus){
                vm.filter.saleStatus = $stateParams.saleStatus
            }else{
                vm.filter.saleStatus = 'all'
            }
            if($stateParams.start){
                vm.filter.start = new Date($stateParams.start)
            }
            if($stateParams.end){
                vm.filter.end = new Date($stateParams.end)
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
