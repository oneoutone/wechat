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
        .controller('LetterCtrl', LetterCtrl);

    LetterCtrl.$inject = ['$scope', '$stateParams','$state', '$location', '$window', 'httpService', 'toastr', '$q'];

    function LetterCtrl ($scope, $stateParams, $state, $location, $window, httpService, toastr, $q) {

        var vm = $scope

        vm.setState = function(state){
            vm.state = state
        }

        vm.pageChanged = function(index){
            vm.currentPage = index
            initList(index)
        }

        function initList(page) {
            httpService.getMyLetterCount(function(r){
                vm.currentPage = page
                vm.allNum = r.count
                initPagination()
            }, function(err){
                console.log(err)
            })

            httpService.getMyLetterList({ page: page}, function(r){
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

        vm.addLetter = function(){
            if(!vm.title || vm.title == ''){
                toastr.error('请输入信件标题')
                return
            }
            if(!vm.content || vm.content == ''){
                toastr.error('请输入信件内容')
                return
            }
            var complain = {
                title: vm.title,
                content: vm.content,
                category: vm.state,
            }
            httpService.addLetter(complain, function(r){
                toastr.success('添加信件内容成功')
                vm.clear()
                initList(vm.currentPage)
            }, function(err){
                toastr.error('提交信件失败，请稍后再试')
            })
        }

        vm.clear = function(){
            vm.title = ''
            vm.content = ''
        }

        vm.app.ready(function(){
            initList(1)
        })

    }
})();
