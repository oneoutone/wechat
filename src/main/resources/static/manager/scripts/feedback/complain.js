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
        .controller('ComplainCtrl', ComplainCtrl);

    ComplainCtrl.$inject = ['$scope', '$state', '$timeout', 'toastr', 'httpService', '$stateParams'];

    function ComplainCtrl($scope, $state, $timeout, toastr, httpService, $stateParams){
        var vm = $scope;
        vm.categoryList = ['全部', '贪污受贿', '公款私用', '职场骚扰', '公报私仇', '倒卖公司资源', '消极工作', '其他']

        vm.fetchData = function(){
            httpService.getAllComplainList({filter: vm.filter, category: vm.category, page: vm.page, released: vm.reply}, function(data){
                vm.complainList = data
            }, function(err){
                console.log(err)
            })

            httpService.getAllComplainCount({filter: vm.filter, category: vm.category, released: vm.reply}, function(data){
                vm.bigTotalItems = data.count
                vm.bigCurrentPage = vm.page
            }, function(err){
                console.log(err)
            })
        }

        vm.doFilter = function(){
            $state.go('app.complainList', {page: 1, filter: vm.filter, category: vm.category, reply:vm.reply})
        }

        $scope.pageChanged = function() {
            if(vm.bigCurrentPage == vm.page){
                return
            }
            $state.go('app.complainList', {page: vm.bigCurrentPage, filter: vm.filter, category: vm.category, reply:vm.reply})
        };

        vm.showResult = function(item){
            vm.complain = item
            $('#m-edit').modal('show')
        }

        vm.addResult = function(){
            if(!vm.complain.resultTitle){
                toastr.error('请输入处理标题')
                return
            }
            if(!vm.complain.result){
                toastr.error('请输入处理内容')
                return
            }
            console.log(vm.complain)
            httpService.processResult({id: vm.complain.id, resultTitle: vm.complain.resultTitle, result: vm.complain.result}, function(r){
                vm.fetchData()
                $('#m-edit').modal('hide')
            }, function(err){
                toastr.error('处理失败，请稍后再试')
            })
        }

        vm.app.ready(function(){
            if($stateParams.filter){
                vm.filter = $stateParams.filter
            }
            if($stateParams.category){
                vm.category = $stateParams.category
            }else{
                vm.category = '全部'
            }
            if($stateParams.page){
                vm.page = $stateParams.page
            }else{
                vm.page = 1
            }
            if($stateParams.reply){
                vm.reply = $stateParams.reply
            }else{
                vm.reply = 'all'
            }
            vm.fetchData()
        })
    }
})();
