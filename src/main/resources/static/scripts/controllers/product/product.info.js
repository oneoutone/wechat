(function() {
    angular
        .module('app')
        .config(function(toastrConfig) {
            angular.extend(toastrConfig, {
                positionClass: 'toast-top-full-width',
                preventOpenDuplicates: true,
                timeOut: 1000
            });
        })
        .controller('ProductInfoCtrl', ProductInfoCtrl);

    ProductInfoCtrl.$inject = ['$scope', '$stateParams','$state', '$location', 'SeUtil', '$window', 'httpService', 'toastr'];

    function ProductInfoCtrl ($scope, $stateParams, $state, $location, SeUtil, $window, httpService, toastr) {
        var vm = $scope

        vm.disable = true
        vm.images = ["assets/images/img2.png", "assets/images/bg-my.png", ]
        vm.showModal = function(){
            if(vm.disable){ return }
            if(vm.product.score > vm.app.setting.user.score){
                toastr.error("您没有足够的积分")
                return
            }
            $("#redeemPop").css('display','block');
            $('#name').val(vm.app.setting.user.nickName);
            $('#phone').val(vm.app.setting.user.phone);
        }

        vm.redeem= function(){
            var name = $('#name').val()
            if(!name){
                toastr.error('请输入名称')
                return
            }
            var phone = $('#phone').val()
            if(!phone || !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(phone))){
                toastr.error('请输入正确的手机号')
                return
            }
            $('#loadingToast').fadeIn(100);
            httpService.redeem({
                userId: vm.app.setting.user.id,
                userName: name,
                userPhone: phone,
                productId: vm.product.id
            }, function(data){
                toastr.success('兑换成功')
                if(vm.product.score != -100){
                    vm.app.setting.user.score = vm.app.setting.user.score - vm.product.score
                }
                httpService.getProduct($stateParams.id, function(r){
                    vm.product.store = r.store
                    if((r.store == -100 || r.store > 0) && vm.app.setting.user.score >=r.score){
                        vm.disable = false
                        vm.title = '兑换'
                    }else if(r.store != -100 && r.store <= 0){
                        vm.disable = true
                        vm.title = '抢完了'
                    }else if(vm.app.setting.user.score < r.score){
                        vm.disable = true
                        vm.title = '积分不足'
                    }
                }, function(err){
                    console.log(err)
                })
                $('#loadingToast').fadeOut(100);
                $("#redeemPop").css('display','none');
            }, function(err){
                console.log(err)
                toastr.error('兑换失败')
            })
        }

        vm.hide = function(){
            $("#redeemPop").css('display','none');
        }

        vm.app.ready(function(){
            if($stateParams.id){
                httpService.getProduct($stateParams.id, function(r){
                    vm.product = r
                    if(vm.product.detailImageUrl){
                        vm.images = vm.product.detailImageUrl.split(',')
                        if((vm.product.store == -100 || vm.product.store > 0) && vm.app.setting.user.score >=vm.product.score){
                            vm.disable = false
                            vm.title = '兑换'
                        }else if(vm.product.store != -100 && vm.product.store <= 0){
                            vm.disable = true
                            vm.title = '抢完了'
                        }else if(vm.app.setting.user.score < vm.product.score){
                            vm.disable = true
                            vm.title = '积分不足'
                        }
                    }
                }, function(err){
                    console.log(err)
                })
            }

        })

    }
})();
