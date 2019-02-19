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
        .controller('PcOrderListCtrl', PcOrderListCtrl);

    PcOrderListCtrl.$inject = ['$scope', '$stateParams','$state', '$location', '$window', '$http', 'toastr', '$q'];

    function PcOrderListCtrl ($scope, $stateParams, $state, $location, $window, $http, toastr, $q) {
        var vm = $scope
        vm.images = []

        vm.status = "all"
        if($stateParams.status){
            vm.status = $stateParams.status
        }

        vm.order = {type: 0}

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

        console.log(vm.app.setting.accessToken)

        vm.setStatus = function(status){
            vm.status = status
            if(status == 'all'){
                vm.list = vm.orders
            }else if(status == 'open'){
                vm.list = vm.orders.filter(function(item){
                    return item.status == "open"
                })
            }else if(status == 'solving'){
                vm.list = vm.orders.filter(function(item){
                    return item.status == "solving"
                })
            }else if(status == 'resolved'){
                vm.list = vm.orders.filter(function(item){
                    return item.status == "resolved"
                })
            }else if(status == 'closed'){
                vm.list = vm.orders.filter(function(item){
                    return item.status == "closed"
                })
            }
        }

        function initList() {
            if(vm.app.setting.accessToken){
                $http({
                    method:'get',
                    url:vm.app.host +  '/jobs',
                    headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken}
                }).success(function(data, header, config, status){
                    console.log(data);
                    for(var i=0; i<data.contents.length; i++){
                        data.contents[i].created = moment(data.contents[i].created_at.replace(/-/g, '/')).format('YYYY-MM-DD HH:mm:ss')
                    }
                    vm.orders = data.contents.sort(function(a,b){
                        return b.created > a.created ? 1 : -1
                    })
                    console.log('sort1')
                    console.log(vm.orders)
                    vm.setStatus(vm.status)
                })
            }

        }

        vm.app.ready(function(){
            initList()
        })

        vm.showAdd = function(){
            vm.images = []
            vm.order = {}
            $("#alertResult").show()
            $(".mask-box").show()

        }

        vm.hide = function(){
            $("#alertResult").hide()
            $(".mask-box").hide()
        }

        vm.fileChanged = function(files){
            console.log('changed')
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = function(theFile) {
               var imagedata = theFile.target.result  //base64编码,用一个变量存储
                $scope.$apply(function () {
                    vm.images.push({file: files[0], data: imagedata})
                    console.log(vm.images)
                })
            };
        }

        vm.remove = function(index){
            vm.images.splice(index,1)
        }

        function uploadImage(id, image){
            var fd = new FormData()
            fd.append('file', image);
            $http({
                method:'put',
                url:vm.app.host +  '/jobs/'+id+'/uploadByPc',
                headers: {'Content-Type':undefined},
                transformRequest: angular.identity,
                data: fd
            }).success(function(data, header, config, status){
                return 'ok'
            }).error(function(data, header, config, status){
                return 'fail'
            })
        }

        vm.openTicket = function(item){
            window.open(vm.app.url+'pc/#/order/'+item.id)
        }

        vm.createOrder = function(){
            if(!vm.order.subject){
                toastr.error('请输入标题')
                return
            }
            if(!vm.order.content){
                toastr.error('请输入内容')
                return
            }
            if(vm.order.type == undefined){
                toastr.error('请选择类型')
                return
            }

            if(vm.app.setting.accessToken){
                $('#loading').fadeIn(100);
                $http({
                    method:'post',
                    url:vm.app.host +  '/jobs',
                    headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken},
                    data: vm.order
                }).success(function(data, header, config, status){
                    console.log(data)
                    if(vm.images.length > 0){
                        var works = []
                        for(var i=0; i<vm.images.length; i++){
                            works.push(uploadImage(data.ticket_id, vm.images[i].file))
                        }
                        $q.all(works).then(function(){
                            $('#loading').fadeOut(100);
                            vm.hide()
                            vm.order = {type: 0}
                            initList()
                        })
                    }else{
                        $('#loading').fadeOut(100);
                        vm.hide()
                        vm.order = {type: 0}
                        initList()
                    }
                }).error(function(data, header, config, status){
                    $('#loading').fadeOut(100);
                    toastr.error('新建失败，请重新尝试')
                })
            }
        }

    }
})();
