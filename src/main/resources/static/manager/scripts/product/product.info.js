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
        .controller('ProductInfoCtrl', ProductInfoCtrl);

    ProductInfoCtrl.$inject = ['$scope', '$state', '$timeout', '$stateParams', 'toastr', 'httpService', 'Upload'];

    function ProductInfoCtrl($scope, $state, $timeout, $stateParams, toastr, httpService, Upload){
        var vm = $scope
        vm.product = {}
        vm.detailImages = []
        vm.app.ready(function(){
            if($stateParams.id){
                httpService.getProduct($stateParams.id, function(data){
                    vm.product = data
                    if(vm.product.detailImageUrl){
                        vm.detailImages = vm.product.detailImageUrl.split(',')
                        console.log(vm.detailImages)
                    }
                    if(vm.product.store = -100){
                        vm.product.store = '-'
                    }
                }, function(err){
                    console.log(err)
                })
            }
        })

        vm.uploadSimpleFile = function(ele){
            if(!ele.files || ele.files.length == 0){
                return
            }
            httpService.getSign(function(data){
                console.log(data)
                var uuidName = 'jinchuang'+(new Date()).getTime()+'_'+ele.files[0].name
                var  new_multipart_params = {
                    'key' : uuidName,
                    'policy': data.policy,
                    'OSSAccessKeyId': data.accessid,
                    'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                    'signature': data.signature,
                };
                Upload.upload({
                    url: data.host,
                    data:  new_multipart_params,
                    file: ele.files[0]
                }).then(function (resp) {
                 console.log('resp')
                    console.log(resp)
                    console.log(data.host+uuidName)
                    vm.product.simpleImageUrl = data.host+uuidName
                })
            }, function(err){

            })
        }

        vm.uploadDetailFile = function(ele){
            if(!ele.files || ele.files.length == 0){
                return
            }
            httpService.getSign(function(data){
                console.log(data)
                var uuidName = 'jinchuang'+(new Date()).getTime()+'_'+ele.files[0].name
                var  new_multipart_params = {
                    'key' : uuidName,
                    'policy': data.policy,
                    'OSSAccessKeyId': data.accessid,
                    'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                    'signature': data.signature,
                };
                Upload.upload({
                    url: data.host,
                    data:  new_multipart_params,
                    file: ele.files[0]
                }).then(function (resp) {
                    console.log('resp')
                    console.log(resp)
                    console.log(data.host+uuidName)
                    vm.detailImages.push(data.host+uuidName)
                })
            }, function(err){

            })
        }

        vm.removeImage = function(index){
            vm.detailImages.splice(index,1)
        }

        vm.changeSimpleImage = function(){
            $('#simpleImageInput')[0].click();
        }

        vm.saveProduct = function(){
            vm.product.detailImageUrl = ''
            if(vm.detailImages.length > 0){
                vm.product.detailImageUrl = vm.detailImages[0]
            }
            if(vm.detailImages.length > 1){
                for(var i=1; i<vm.detailImages.length; i++){
                    vm.product.detailImageUrl += ','+ vm.detailImages[i]
                }
            }
            if(!vm.product.abbreviation){
                toastr.error("请输入产品简称")
                return
            }
            if(!vm.product.name){
                toastr.error("请输入产品全称")
                return
            }
            if(!vm.product.simpleImageUrl){
                toastr.error("请上传封面图")
                return
            }
            if(!vm.product.detailImageUrl){
                toastr.error("请上传详情图")
                return
            }
            if(!vm.product.start){
                toastr.error("请选择开始时间")
                return
            }
            if(!vm.product.end){
                toastr.error("请选择结束时间")
                return
            }
            if(!vm.product.score){
                toastr.error("请输入兑换所需积分")
                return
            }
            var reg = /^\d+$/
            if (!reg.test(vm.product.score)) {
                toastr.error("兑换所需积分只能为整数")
                return false;
            }
            if(!vm.product.store){
                toastr.error("请输入库存")
                return
            }
            if (!reg.test(vm.product.store) && vm.product.store != '-') {
                toastr.error("库存只能为整数或者-")
                return false;
            }
            if(!vm.product.price){
                toastr.error("请输入市场价")
                return
            }
            if (!reg.test(vm.product.price)) {
                toastr.error("市场价只能为整数")
                return false;
            }
            if(moment(vm.product.start).toDate() >= moment(vm.product.end).toDate()){
                toastr.error("开始时间必须早于结束时间")
                return
            }
            if(vm.product.start){
                vm.product.start = moment(vm.product.start).format('YYYY-MM-DD HH:mm:ss')
            }
            if(vm.product.end){
                vm.product.end = moment(vm.product.end).format('YYYY-MM-DD HH:mm:ss')
            }
            httpService.createProduct(vm.product, function(){
                toastr.success("新建成功")
                history.go(-1)
            }, function(err){
                console.log(err)
            })
        }
    }
})();
