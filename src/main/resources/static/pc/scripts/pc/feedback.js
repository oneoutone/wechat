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
        .controller('FeedbackCtrl', FeedbackCtrl);

    FeedbackCtrl.$inject = ['$scope', '$stateParams','$state', '$location', '$window', 'httpService', 'toastr', '$q'];

    function FeedbackCtrl ($scope, $stateParams, $state, $location, $window, httpService, toastr, $q) {

        var vm = $scope

        vm.sort = 'created'

        vm.state = '人事招聘'
        vm.open = false
        vm.hide = true
        vm.type = '按时间'

        vm.setState = function(state){
            vm.state = state
        }

        vm.typeChanged = function(){
            initList(vm.currentPage)
        }

        vm.pageChanged = function(index){
           vm.currentPage = index
            initList(index)
        }

        function initList(page) {
            if(vm.type == "只看我提交的"){
                httpService.getMyFeedbackCount(function(r){
                    vm.currentPage = page
                    //vm.pageChanged(page)
                    vm.allNum = r.count
                    initPagination()
                }, function(err){
                    console.log(err)
                })

                httpService.getMyFeedbackList({order: 'created', page: page}, function(r){
                    vm.list = r
                }, function(err){
                    console.log(err)
                })

            }else {
                if(vm.type == "按认同率"){
                    vm.sort = 'support'
                }else{
                    vm.sort = 'created'
                }
                httpService.getFeedbackCount(function(r){
                    vm.currentPage = page
                    //vm.pageChanged(page)
                    vm.allNum = r.count
                    initPagination()
                }, function(err){
                    console.log(err)
                })

                httpService.getFeedback({order: vm.sort, page: page}, function(r){
                    vm.list = r
                }, function(err){
                    console.log(err)
                })
            }

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

        vm.addFeedback = function(){
            if(!vm.title || vm.title == ''){
                toastr.error('请输入反馈标题')
                return
            }
            if(!vm.content || vm.content == ''){
                toastr.error('请输入反馈内容')
                return
            }
            var feedback  = {
                title: vm.title,
                content: vm.content,
                category: vm.state,
                hide: vm.hide,
                open: vm.open,
            }
            httpService.addFeedback(feedback, function(r){
                toastr.success('添加反馈内容成功')
                vm.clear()
                initList(vm.currentPage)
            }, function(err){
                toastr.error('提交反馈失败，请稍后再试')
            })
        }

        vm.clear = function(){
            vm.state = '人事招聘'
            vm.open = false
            vm.hide = true
            vm.title = ''
            vm.content = ''
        }

        vm.changeSupport = function(item){
            if(item.agree){
                httpService.unSupport({id: item.id}, function(){
                    toastr.success("更新认同状态成功")
                    initList(vm.currentPage)
                }, function(err){
                    console.log(err)
                })
            }else{
                httpService.support({id: item.id}, function(r){
                    toastr.success("更新认同状态成功")
                    initList(vm.currentPage)
                }, function(err){
                    console.log(err)
                })
            }
        }

        vm.app.ready(function(){
            initList(1)
        })

    }
})();
