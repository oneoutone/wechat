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
        .controller('LetterCtrl', LetterCtrl);

    LetterCtrl.$inject = ['$scope', '$state', '$timeout', 'toastr', 'httpService', '$stateParams'];

    function LetterCtrl($scope, $state, $timeout, toastr, httpService, $stateParams){
        var vm = $scope;

        vm.fetchData = function(){
            httpService.getAllLetterList({filter: vm.filter, page: vm.page, reply: vm.reply}, function(data){
                vm.letterList = data
            }, function(err){
                console.log(err)
            })

            httpService.getAllLetterCount({filter: vm.filter, reply: vm.reply}, function(data){
                vm.bigTotalItems = data.count
                vm.bigCurrentPage = vm.page
            }, function(err){
                console.log(err)
            })
        }

        vm.doFilter = function(){
            $state.go('app.letterList', {page: 1, filter: vm.filter, reply:vm.reply})
        }

        $scope.pageChanged = function() {
            if(vm.bigCurrentPage == vm.page){
                return
            }
            $state.go('app.letterList', {page: vm.bigCurrentPage, filter: vm.filter, reply:vm.reply})
        };

        vm.showResult = function(item){
            vm.letter = item
            $('#m-edit').modal('show')
        }

        vm.addResult = function(){
            if(!vm.letter.result){
                toastr.error('请输入回复内容')
                return
            }
            httpService.replyLetter({id: vm.letter.id, result: vm.letter.result}, function(r){
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
