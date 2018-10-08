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
        .controller('UserProfileCtrl', UserProfileCtrl);

    UserProfileCtrl.$inject = ['$scope', '$stateParams','$state', 'Upload', '$timeout', 'toastr'];

    function UserProfileCtrl($scope, $stateParams,$state, Upload, $timeout, toastr){
        var vm = $scope;
        vm.user= {};
        if($stateParams.id){
            User.findById({id: $stateParams.id}, function(user){
                vm.user = user;
                vm.hasAvatar = true
            }, function(err){
                console.info(err);
            });

            User.prototype$__get__roles({id: $stateParams.id}, function(result){
                vm.currentRole = {};
                for(var i=0; i<result.length; i++) {
                    vm.currentRole[result[i].name] = true
                }
                if(vm.currentRole.director){
                    vm.currentRole.clerk = true;
                    vm.currentRole.executive = true;
                    vm.currentRole.finance = true
                }
                console.info(result)
            }, function(err){
                console.info(err)
            });

            vm.app.ready(function(){

            });
        }else{
            vm.hasAvatar = true
        }

        vm.upsertUser = function(){
            if(!$('#nameInput').hasClass('ng-valid')){
                toastr.error("姓名不能为空");
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

            if($stateParams.id){
                vm.profileLoading = true;
                User.prototype$updateAttributes({id: $stateParams.id}, vm.user, function(user){
                    $timeout(function() {
                        vm.profileLoading = false;
                        if(user.id == vm.app.user.id){
                            vm.app.user.name = user.name
                        }
                    }, 500);
                }, function(err){
                    vm.profileLoading = false;
                    if(err.status == 423){
                        toastr.error("邮箱已被绑定， 更新失败");
                    }else if(err.status == 424){
                        toastr.error("手机号已被绑定，更新失败");
                    }else{
                        toastr.error("更新失败， 可能是服务器正在维护，请稍后重新尝试");
                    }
                    console.info(err);
                } )
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

                vm.user.username="phone."+vm.user.phone;
                vm.user.password = $('#passwordInput').val();

                vm.profileLoading = true;
                User.createManager({user: vm.user}, function(user){
                    console.info(user);
                    $timeout(function() {
                        vm.profileLoading = false;
                        $scope.app.newProfile = true;
                        $state.go('app.user.info', {id: user.id})
                    }, 500);
                }, function(err){
                    console.info(err);
                    vm.profileLoading = false;
                    if(err.status == 423){
                        toastr.error("手机号或者邮箱已存在，新建失败");
                    }else{
                        toastr.error("通讯错误，请检查您的网络");
                    }
                })
            }
        };

        vm.upsertPermission = function(){
            vm.permissionLoading = true;
            if($stateParams.id){
                var roleList = [];
                if(vm.currentRole.director == true){
                    roleList.push("director");
                    roleList.push("clerk");
                    roleList.push("executive");
                    roleList.push("finance");
                }
                if(vm.currentRole.clerk == true){
                    roleList.push("clerk");
                }
                if(vm.currentRole.executive == true){
                    roleList.push("executive");
                }
                if(vm.currentRole.finance == true){
                    roleList.push("finance");
                }
                User.prototype$updatePermission({id: $stateParams.id}, {roles: roleList},function(result){
                    $timeout(function() {
                        vm.permissionLoading = false;
                    }, 500);
                }, function(err){
                    console.info(err);
                    toastr.error("更新失败");
                    vm.permissionLoading = false;
                })
            }
        };

        $scope.uploadUserLogo = function(file) {
            if(file == undefined){
                return
            }
            vm.hasAvatar = false;

            var uuidName = SeUtil.uuid() + "." + SeUtil.getFileNameExtension(file.name);

            Util.getOssSign(function(result){
                var uuidName = SeUtil.uuid() + "." + SeUtil.getFileNameExtension(file.name);
                var  new_multipart_params = {
                    'key' : uuidName,
                    'policy': result.policy,
                    'OSSAccessKeyId': result.accessid,
                    'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                    'signature': result.signature,
                };
                Upload.upload({
                    url: result.host,
                    data:  new_multipart_params,
                    file: file
                }).then(function (resp) {
                    var url = result.host+uuidName;
                    vm.hasAvatar = true;
                    vm.user.avatar = url;
                    if($stateParams.id){
                        User.prototype$updateAttributes({id: $stateParams.id}, {avatar: url}, function(user){
                            if($stateParams.id == $scope.app.user.id){
                                $scope.app.user.avatar=$scope.user.avatar
                            }
                        }, function(err){
                            console.info(err);
                        });
                    }
                }, function (evt) {
                    console.log('progress: ');
                });
            }, function(err){
                console.info(err)
            })
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
            User.prototype$updateAttributes({id: $stateParams.id}, {password: $('#newPasswordInput').val()}, function(user){
                console.info("update password succ");
                $timeout(function() {
                    vm.passwordLoading = false;
                }, 500);
            }, function(err){
                toastr.error("更新失败， 可能是服务器正在维护，请稍后重新尝试");
                vm.passwordLoading = false;
                console.info(err);
            })

        };

        $scope.goBack = function(){
            if($scope.app.newProfile == true){
                $scope.app.newProfile = false;
                $state.go('app.manager.list')
            }else{
                window.history.go(-1)
            }
        };

        $scope.upsertSpace = function(){
            $scope.spaceLoading = true;
            var sp = [];
            for(var i=0; i<$scope.app.spaces.length; i++){
                if($scope.app.spaces[i].checked == true){
                    sp.push($scope.app.spaces[i].id)
                }
            }
            User.prototype$updateSpace({id:$stateParams.id}, {spaces: sp}, function(result){
                console.info(result);
                $timeout(function() {
                    $scope.spaceLoading = false
                }, 500);
            },function(err){
                toastr.error("更新失败");
                $scope.spaceLoading = false
            })
        };

        $scope.checkAll = function(){
            if(vm.currentRole.director){
                vm.currentRole.clerk = true;
                vm.currentRole.executive = true;
                vm.currentRole.finance = true
            }else{
                vm.currentRole.clerk = false;
                vm.currentRole.executive = false;
                vm.currentRole.finance = false
            }
        }

    }
})();
