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
        .controller('ComplainCtrl', ComplainCtrl);

    ComplainCtrl.$inject = ['$scope', '$stateParams','$state', '$location', '$window', 'httpService', 'toastr', '$q'];

    function ComplainCtrl ($scope, $stateParams, $state, $location, $window, httpService, toastr, $q) {

        var vm = $scope

        vm.state = "贪污受贿"

        vm.setState = function(state){
            vm.state = state
        }

        vm.pageChanged = function(index){
            vm.currentPage = index
            initList(index)
        }

        function initList(page) {
            httpService.getAllComplainCount({category: '全部', released: 'true'}, function(r){
                vm.currentPage = page
                vm.allNum = r.count
                initPagination()
            }, function(err){
                console.log(err)
            })

            httpService.getAllComplainList({category: '全部', released: 'true', page: page}, function(r){
                vm.list = r
            }, function(err){
                console.log(err)
            })
        }

        function initPagination(){
            vm.pages = []
            var PageNum =  Math.ceil(vm.allNum/5)
            for(var i = vm.currentPage -2; i<vm.currentPage+3; i++){
                if(i> 0 && i<=PageNum){
                    vm.pages.push(i)
                }
            }
            if(vm.currentPage + 2 <PageNum){
                vm.pages.push('...')
                vm.pages.push(PageNum)
            }
        }

        vm.addComplain = function(){
            if(!vm.title || vm.title == ''){
                toastr.error('请输入反馈标题')
                return
            }
            if(!vm.content || vm.content == ''){
                toastr.error('请输入反馈内容')
                return
            }
            var complain = {
                title: vm.title,
                content: vm.content,
                category: vm.state,
            }
            httpService.addComplain(complain, function(r){
                toastr.success('添加投诉内容成功')
                vm.clear()
                initList(vm.currentPage)
            }, function(err){
                toastr.error('提交投诉失败，请稍后再试')
            })
        }

        vm.clear = function(){
            vm.state = '贪污受贿'
            vm.title = ''
            vm.content = ''
        }

        vm.app.ready(function(){
            initList(1)
        })

    }
})();
