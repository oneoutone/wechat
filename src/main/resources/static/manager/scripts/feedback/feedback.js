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
        .controller('FeedbackCtrl', FeedbackCtrl);

    FeedbackCtrl.$inject = ['$scope', '$state', '$timeout', 'toastr', 'httpService', '$stateParams'];

    function FeedbackCtrl($scope, $state, $timeout, toastr, httpService, $stateParams){
        var vm = $scope;
        vm.categoryList = ['全部', '人事招聘', '薪酬绩效', '考勤制度', '系统软件', '稽核品管制度', '福利待遇', '职场环境', '其他']

        vm.fetchData = function(){
            httpService.getAllFeedbackList({filter: vm.filter, category: vm.category, page: vm.page}, function(data){
                vm.feedbackList = data
            }, function(err){
                console.log(err)
            })

            httpService.getAllFeedbackCount({filter: vm.filter, category: vm.category}, function(data){
                vm.bigTotalItems = data.count
                vm.bigCurrentPage = vm.page
            }, function(err){
                console.log(err)
            })
        }

        vm.doFilter = function(){
            $state.go('app.feedbackList', {page: 1, filter: vm.filter, category: vm.category})
        }

        $scope.pageChanged = function() {
            if(vm.bigCurrentPage == vm.page){
                return
            }
            $state.go('app.feedbackList', {page: vm.bigCurrentPage, filter: vm.filter, category: vm.category})
        };

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
            vm.fetchData()
        })
    }
})();
