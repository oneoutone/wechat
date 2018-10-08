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
        .controller('OrderInfoCtrl', OrderInfoCtrl);

    OrderInfoCtrl.$inject = ['$scope', '$stateParams','$state', '$location', '$window', '$http', 'toastr'];

    function OrderInfoCtrl ($scope, $stateParams, $state, $location, $window, $http, toastr) {
        var vm = $scope

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
        console.log($stateParams)
        vm.list = []
        console.log("start")
        if(vm.app.setting.accessToken){
            $http({
                method:'get',
                url:vm.app.host +  '/jobs/'+vm.id,
                headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken}
            }).success(function(data, header, config, status){
                console.log(data);
                vm.ticket = data.ticket
                console.log(vm.ticket.created_at)
                vm.ticket.created = moment(vm.ticket.created_at).format('YYYY-MM-DD HH:mm:ss')
            })

            $http({
                method:'get',
                url:vm.app.host +  '/jobs/'+vm.id+'/replies',
                headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken}
            }).success(function(data, header, config, status){
                vm.replies = data.replies
                console.log("vm.replies")
                console.log(vm.replies)
                for(var i=0; i<vm.replies.length; i++){
                    vm.replies[i].created = moment(vm.replies[i].created_at).format('YYYY-MM-DD HH:mm:ss')
                }
            })
        }

        vm.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            console.log("ngRepeatFinished")
            console.log(vm.replies)
            for(var  i=0; i<vm.replies.length; i++){
                if(vm.replies[i].content_format == 'json'){
                    var json = JSON.parse(vm.replies[i].content)
                    $('.reply-content').eq(i).html(json.data.content)
                }else {
                    $('.reply-content').eq(i).html('<p>'+vm.replies[i].content+'</p>')
                }

            }
        })

        vm.showDialog = function(){
            $('#dialog').fadeIn(200)
        };

        vm.hideDialog = function(){
            $('#dialog').fadeOut(200)
        };

        vm.resolve = function(){
            $('#dialog').fadeOut(200)
            $('#loadingToast1').fadeIn(100);
            $http({
                method:'post',
                url:vm.app.host +  '/jobs/'+vm.id+'/solve',
                data:{id: vm.id},
                headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken}
            }).success(function(data, header, config, status){
                console.log(data)
                if(data.status == 0){
                    vm.ticket.status_en = 'resolved'
                    $('#loadingToast1').fadeOut(100);
                    toastr.success('更新成功')
                    $state.go('order.list')
                }else{
                    $('#loadingToast1').fadeOut(100);
                    toastr.error('失败')
                }

            })
        }

        vm.preview = function(image){
            wx.previewImage({
                current: image.url,
                urls: [image.url]
            });
        }


    }
})();
