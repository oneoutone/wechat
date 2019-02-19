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
        .controller('PcOrderInfoCtrl', PcOrderInfoCtrl);

    PcOrderInfoCtrl.$inject = ['$scope', '$stateParams','$state', '$location', '$window', '$http', 'toastr', '$q'];

    function PcOrderInfoCtrl ($scope, $stateParams, $state, $location, $window, $http, toastr, $q) {
        var vm = $scope


        vm.id = $stateParams.id
        vm.list = []

        vm.initData = function(){
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
            $http({
                method:'post',
                url:vm.app.host +  '/jobs/'+vm.ticket.id+'/solve',
                data:{id: vm.id},
                headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken}
            }).success(function(data, header, config, status){
                console.log(data)
                if(data.status == 0){
                    vm.ticket.status_en = 'resolved'
                    toastr.success('解决成功')
                }else{
                    $('#loadingToast1').fadeOut(100);
                    toastr.error('失败')
                }

            })
        }

        vm.fileChanged = function(files){
            var fd = new FormData()
            fd.append('file', files[0]);
            $http({
                method:'put',
                url:vm.app.host +  '/jobs/'+vm.id+'/uploadReplyFileByPc',
                headers: {'Content-Type':undefined},
                transformRequest: angular.identity,
                data: fd
            }).success(function(data, header, config, status){
                var reader = new FileReader();
                reader.readAsDataURL(files[0]);
                reader.onload = function(theFile) {
                    var imagedata = theFile.target.result  //base64编码,用一个变量存储
                    $scope.$apply(function () {
                        vm.images.push({file: files[0], data: imagedata, dataId: data.message.attachment_id})
                        console.log(vm.images)
                    })
                };
            }).error(function(data, header, config, status){
                toastr.error('上传图片失败')
            })
        }

        vm.remove = function(index){
            vm.images.splice(index,1)
        }

        vm.reply = function(){
            if(!vm.content){
                toastr.error('请输入内容')
                return
            }
                $http({
                    method:'post',
                    url:vm.app.host +  '/jobs/'+vm.id+"/reply",
                    headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken},
                    data: {content: vm.content, attachment_ids: vm.images.map(function(item){ return item.dataId})}
                }).success(function(data, header, config, status){
                    console.log(data)
                    vm.initData()
                    vm.hide()
                }).error(function(data, header, config, status){
                    $('#loadingToast1').fadeOut(100);
                    toastr.error('新建失败，请重新尝试')
                })
            }


        vm.preview = function(image){
            wx.previewImage({
                current: image.url,
                urls: [image.url]
            });
        }

        vm.showAdd = function(){
            vm.content = undefined
            vm.images = []
            $("#alertResult").show();
            $(".mask-box").show();
        }

        vm.hide = function(){
            $("#alertResult").hide();
            $(".mask-box").hide();
        }

        vm.flag = true
        vm.showBig = function(index){
            if(vm.index != undefined && vm.index != index && vm.flag == false){
                return
            }
            vm.index = index
                var img = $('.ig1').eq(index)
                var imgH = img.height(); //获取图片的高度
                var imgW = img.width(); //获取图片的宽度
                if(vm.flag){
                    //图片为正常状态,设置图片宽高为现在宽高的2倍
                    vm.flag = false;//把状态设为放大状态
                    img.height(imgH*3)
                    img.width(imgW*3)
                }else{
                    //图片为放大状态,设置图片宽高为现在宽高的二分之一
                    vm.flag = true;//把状态设为正常状态
                    img.height(imgH/3)
                    img.width(imgW/3)
                }

            }

        vm.flag1 = true
        vm.showBig1 = function(index1){
            if(vm.index1 != undefined && vm.index1 != index1 && vm.flag1 == false){
                return
            }
            vm.index1 = index1
            var img = $('.ig2').eq(index1)
            var imgH = img.height(); //获取图片的高度
            var imgW = img.width(); //获取图片的宽度
            if(vm.flag1){
                //图片为正常状态,设置图片宽高为现在宽高的2倍
                vm.flag1 = false;//把状态设为放大状态
                img.height(imgH*3)
                img.width(imgW*3)
            }else{
                //图片为放大状态,设置图片宽高为现在宽高的二分之一
                vm.flag1 = true;//把状态设为正常状态
                img.height(imgH/3)
                img.width(imgW/3)
            }

        }

        vm.goBack = function(){
            history.go(-1)
        }

        vm.app.ready(function(){
            vm.initData()
        })
    }
})();
