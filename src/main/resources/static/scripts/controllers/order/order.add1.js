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
        .controller('OrderAddCtrl', OrderAddCtrl);

    OrderAddCtrl.$inject = ['$scope', '$stateParams','$state', '$http', 'toastr', '$location'];

    function OrderAddCtrl ($scope, $stateParams, $state, $http, toastr, $location) {
        var vm = $scope;

        vm.images = [];

        $http({
            method:'post',
            url:vm.app.host +  '/util/wechatSign',
            headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken},
            data: {url: $location.absUrl().split('#')[0]}
        }).success(function(data, header, config, status){
            console.log(data)
            wx.config(data);
        }).error(function(data, header, config, status){
            console.log(data)
        })

        vm.remove = function(index){
            vm.images.splice(index,1);
        }

        vm.uploadImage = function(udeskId){
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    wx.uploadImage({
                        localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 0, // 默认为1，显示进度提示
                        success: function (res1) {
                            console.log(res1)
                            var serverId = res1.serverId;
                            wx.getLocalImgData({
                                localId: res1.localId, // 图片的localID
                                success: function (res2) {
                                    $scope.$apply(function () {
                                        vm.images.push({localId: res1.localId, data: res2.localData, serverId: serverId})
                                    })
                                }
                            });
                        }
                    });
                }
            });
        };


        vm.createOrder = function(){
            var subject = $('#subject').val()
            var content = $('#content').val()
            if(!subject){
                toastr.error('请输入标题')
                return
            }
            if(!vm.type){
                toastr.error('请选择类型')
                return
            }
            if(!content){
                toastr.error('请输入内容')
                return
            }
            if(vm.app.setting.accessToken){
                $('#loadingToast1').fadeIn(100);
                $http({
                    method:'post',
                    url:vm.app.host +  '/jobs',
                    headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken},
                    data: {subject: subject, content: content, type: vm.type.value}
                }).success(function(data, header, config, status){
                    console.log(data)
                    if(vm.images.length > 0 && data.ticket_id){
                        vm.mediaList = ""
                        for(var i=0; i<vm.images.length; i++){
                            if(i == 0){
                                vm.mediaList += vm.images[i].serverId
                            }else{
                                vm.mediaList += "|"+vm.images[i].serverId
                            }

                        }
                        $http({
                            method:'post',
                            url:vm.app.host +  '/jobs/'+data.ticket_id+ '/uploadAttach',
                            headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken},
                            data: {mediaIds: vm.mediaList}
                        }).success(function(data, header, config, status){
                            console.log(data)
                        }).error(function(data, header, config, status){
                            console.log(data)
                        })
                    }
                    $('#loadingToast1').fadeOut(100);
                    $state.go('order.list')
                }).error(function(data, header, config, status){
                    $('#loadingToast1').fadeOut(100);
                    toastr.error('新建失败，请重新尝试')
                })
            }
        }

        vm.types = [{
            label: '账号、权限相关',
            value: 0
        }, {
            label: 'HR相关',
            value: 1
        }, {
            label: '电话配置及故障',
            value: 2
        },{
            label: '网络故障、视频会议、监控、考勤机故障',
            value: 3
        }, {
            label: '云桌面故障',
            value: 4
        }]

        vm.showSelect = function(){
            weui.picker(vm.types, {
                onChange: function (result) {
                    //vm.type=result
                    //console.log(result);
                },
                onConfirm: function (result) {
                    $scope.$apply(function () {
                        vm.type=result[0]
                    });
                    console.log(result[0]);
                }
            });
        }


    }
})();
