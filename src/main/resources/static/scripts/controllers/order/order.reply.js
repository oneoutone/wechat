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
        .controller('OrderReplyCtrl', OrderReplyCtrl);

    OrderReplyCtrl.$inject = ['$scope', '$stateParams','$state', '$http', 'toastr', '$location'];

    function OrderReplyCtrl ($scope, $stateParams, $state, $http, toastr, $location) {
        var vm = $scope;
        vm.images =[]

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

        vm.id = $stateParams.id
        vm.createOrder = function(){
            var content = $('#content').val()
            if(!content){
                toastr.error('请输入内容')
                return
            }
            $('#loadingToast1').fadeIn(100);
            if(vm.app.setting.accessToken){
                $http({
                    method:'post',
                    url:vm.app.host +  '/jobs/'+vm.id+"/reply",
                    headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken},
                    data: {content: content, attachment_ids: vm.images.map(function(item){ return item.dataId})}
                }).success(function(data, header, config, status){
                    console.log(data)
                    $('#loadingToast1').fadeOut(100);
                    history.back()
                }).error(function(data, header, config, status){
                    $('#loadingToast1').fadeOut(100);
                    toastr.error('新建失败，请重新尝试')
                })
            }
        }

        vm.remove = function(index){
            vm.images.splice(index,1);
        }


        vm.uploadImage = function(){
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
                            $http({
                                method:'post',
                                url:vm.app.host +  '/jobs/'+vm.id+ '/uploadReplyAttach',
                                headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken},
                                data: {mediaId: serverId}
                            }).success(function(data, header, config, status){
                                wx.getLocalImgData({
                                    localId: res1.localId, // 图片的localID
                                    success: function (res2) {
                                        $scope.$apply(function () {
                                            vm.images.push({localId: res1.localId, data: res2.localData, serverId: serverId, dataId: data.message.attachment_id})
                                        })
                                    }
                                });
                            }).error(function(data, header, config, status){
                                console.log(data)
                            })
                        }
                    });
                }
            });
        };
    }
})();
