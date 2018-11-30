// code style: https://github.com/johnpapa/angular-styleguide

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
        .controller('ManagerInfoCtrl', ManagerInfoCtrl);

    ManagerInfoCtrl.$inject = ['$scope', '$stateParams','$state', '$timeout', 'toastr', 'httpService'];

    function ManagerInfoCtrl($scope, $stateParams,$state, $timeout, toastr, httpService){
        var vm = $scope;
        vm.user= {};
        $scope.app.newProfile = true
        vm.app.ready(function(){
            if($stateParams && $stateParams.id) {
                vm.id = $stateParams.id
                httpService.getProfile(vm.id, function (data) {
                    vm.user = data
                    if(vm.user.managerRoles){
                        var roles = vm.user.managerRoles.split(',')
                        vm.user.roles = {}
                        for(var i=0; i<roles.length; i++){
                            vm.user.roles[roles[i]] = true
                        }
                    }
                    console.log(vm.user.roles)
                    if(vm.user.roles.admin == true){
                        vm.user.roles.productEdit = true
                        vm.user.roles.productConfirm = true
                        vm.user.roles.manage = true
                    }
                }, function (err) {
                    console.log(err)
                    toastr.error("获取管理员信息失败")
                })
            }
        })


        vm.upsertUser = function(){
            if(!$('#nameInput').hasClass('ng-valid')){
                toastr.error("用户名不能为空");
                $('#nameInput').addClass('ng-dirty');
                $('#nameInput').addClass('ng-invalid');
                return;
            }

            if(!$('#emailInput').hasClass('ng-valid')){
                if($('#emailInput').hasClass('ng-invalid-required')) {
                    toastr.error("邮箱不能为空");
                }else{
                    toastr.error("邮箱格式错误");
                }
                $('#emailInput').addClass('ng-dirty');
                $('#emailInput').addClass('ng-invalid');
                return
            }

            if(!$('#phoneInput').hasClass('ng-valid')){
                if($('#phoneInput').hasClass('ng-invalid-required')) {
                    toastr.error("手机号不能为空");
                }else{
                    toastr.error("手机号格式错误");
                }
                $('#phoneInput').addClass('ng-dirty');
                $('#phoneInput').addClass('ng-invalid');
                return
            }

            if($stateParams.id) {
                vm.profileLoading = true;
                httpService.upsertManager(vm.user, function (data) {
                    vm.user=data
                    vm.profileLoading = false
                    toastr.success('更新信息成功')
                }, function (err) {
                    vm.profileLoading = false
                    toastr.error('更新信息失败')
                })
            }else{
                if(!$('#passwordInput').hasClass('ng-valid') || !$('#confirmInput').hasClass('ng-valid')){
                    if(!$('#passwordInput').hasClass('ng-valid')){
                        toastr.error("请输入密码");
                        $('#passwordInput').addClass('ng-dirty');
                        $('#passwordInput').addClass('ng-invalid');
                    }else{
                        toastr.error("请输入确认密码");
                        $('#confirmInput').addClass('ng-dirty');
                        $('#confirmInput').addClass('ng-invalid');
                    }
                    return;
                }

                if($('#passwordInput').val()!= $('#confirmInput').val()){
                    toastr.error("两次输入的密码不匹配");
                    $('#passwordInput').val("");
                    $('#confirmInput').val("");
                    return;
                }

                vm.user.password = $('#passwordInput').val();
                vm.user.managerRoles = ['office']
                vm.profileLoading = true;

                httpService.upsertManager(vm.user, function (data) {
                    vm.user = data
                    vm.profileLoading = false
                    toastr.success('更新信息成功')
                    $timeout(function() {
                        $state.go('app.manager.info', {id: data.id})
                    }, 500);
                }, function (err) {
                    vm.profileLoading = false
                    toastr.error('新建管理员失败')
                })
            }
        };

        vm.upsertPermission = function(){
            vm.permissionLoading = true;
            if($stateParams.id){
                var roles = 'office'
                if(vm.user.roles.productEdit == true){
                    roles += ',productEdit'
                }
                if(vm.user.roles.productConfirm == true){
                    roles += ',productConfirm'
                }
                if(vm.user.roles.manage == true){
                    roles += ',manage'
                }

                httpService.upsertManager({managerRoles: roles, id: vm.user.id}, function(data){
                    vm.permissionLoading = false;
                    toastr.success("更新成功");
                }, function(err){
                    console.info(err);
                    toastr.error("更新失败");
                    vm.permissionLoading = false;
                })

            }
        };

        vm.updatePassword = function(){
            if(!$('#newPasswordInput').hasClass('ng-valid') || !$('#newConfirmInput').hasClass('ng-valid')){
                if(!$('#newPasswordInput').hasClass('ng-valid')){
                    toastr.error("请输入密码");
                    $('#newPasswordInput').addClass('ng-dirty');
                    $('#newPasswordInput').addClass('ng-invalid');
                }else{
                    toastr.error("请再次输入密码");
                    $('#newConfirmInput').addClass('ng-dirty');
                    $('#newConfirmInput').addClass('ng-invalid');
                }
                return;
            }

            if($('#newPasswordInput').val()!= $('#newConfirmInput').val()){
                toastr.error("两次输入的密码不匹配");
                $('#newPasswordInput').val("");
                $('#newConfirmInput').val("");
                return;
            }
            vm.passwordLoading = true;
            httpService.upsertManager({id: vm.user.id, password: $('#newPasswordInput').val()}, function(data){
                $timeout(function() {
                    vm.passwordLoading = false;
                    toastr.success('更新成功')
                }, 500);
            }, function(err){
                toastr.error("更新失败， 可能是服务器正在维护，请稍后重新尝试");
                vm.passwordLoading = false;
            })

        };
        $scope.goBack = function(){
            $state.go('app.manager.list')
        };

    }
})();
