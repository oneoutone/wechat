(function() {
    angular
        .module('app')
        .config(function(toastrConfig) {
            angular.extend(toastrConfig,
                {positionClass: 'toast-top-full-width',
                    preventOpenDuplicates: true,
                    timeOut: 1000
                });
        })
        .controller('SignInCtrl', SignInCtrl);
    SignInCtrl.$inject = ['$scope','$state', 'toastr', 'httpService'];

    function SignInCtrl ($scope, $state, toastr, httpService) {
        var vm =  $scope
        vm.user = {}
        vm.app.ready(function(){
            if (vm.app.isAuthenticated()){
                if(vm.app.setting.user.roles.productEdit){
                    $state.go('app.product.list')
                    return
                }
                if(vm.app.setting.user.roles.productConfirm){
                    $state.go('app.confirm.list')
                    return
                }
                if(vm.app.setting.user.roles.manage){
                    $state.go('app.manager.list')
                    return
                }
                if(vm.app.setting.user.roles.admin){
                    $state.go('app.manager.list')
                    return
                }
            }

        })



        vm.signin = function() {
            if (!vm.user.username || !$scope.user.pwd){
                if(!vm.user.username){
                    vm.error('请输入用户名')
                    return;
                }
                if(!vm.user.pwd){
                    toastr.error('请输入密码')
                    return;
                }
                return;
            }
            $scope.loading = true

            httpService.signin(vm.user, function(result) {
                $scope.loading = false
                vm.app.setUser(result)
                vm.app.init(function(){
                    if (vm.app.isAuthenticated()) {
                        if (vm.app.setting.user.roles.productEdit) {
                            $state.go('app.product.list')
                            return
                        }
                        if (vm.app.setting.user.roles.productConfirm) {
                            $state.go('app.confirm.list')
                            return
                        }
                        if (vm.app.setting.user.roles.manage) {
                            $state.go('app.manager.list')
                            return
                        }
                        if (vm.app.setting.user.roles.admin) {
                            $state.go('app.manager.list')
                            return
                        }
                    }
                })

            }, function(result){
                console.log(result)
                $scope.loading = true
                toastr.error(result.message)
            })

            // User.login({
            //     rememberMe: $scope.rememberMe
            // }, {
            //     username: $scope.user.phone,
            //     password: $scope.user.pswd,
            //     rememberMe: $scope.user.remember
            // }, function (result) {
            //     console.log("login ok");
            //     $scope.loading = false;
            //
            //     if (result.user.spaceId) {
            //         $scope.app.init(function () {
            //             $state.go('app.teamManager.users');
            //         })
            //     } else {
            //         $scope.app.init(function() {
            //             $state.go('app.dashboard');
            //         })
            //     }
            //
            // },function (err) {
            //     console.info("err",err.status);
            //     $scope.loading = false;
            //     if(err.status == 401){
            //         toastr.error(err.message);
            //     }else{
            //         toastr.error('登录失败，请重新尝试');
            //     }
            // })
        }
    }

})();
