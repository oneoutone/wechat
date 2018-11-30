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
        if (vm.app.isAuthenticated())
            alert("已经登录")

        vm.signin = function() {
            toastr.error('hi')
            console.info("hello1")
            console.info(httpService.ao)
            console.info("hello")
            httpService.print1()
            // if (!vm.user.username || !$scope.user.pwd){
            //     if(!vm.user.username){
            //         vm.error('请输入用户名')
            //         return;
            //     }
            //     if(!vm.user.pwd){
            //         toastr.error('请输入密码')
            //         return;
            //     }
            //     return;
            // }
            // $scope.loading = true
            //
            // httpService.signin(vm.user, function(result){
            //     console.log(result)
            //     $scope.loading = false
            // })

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
