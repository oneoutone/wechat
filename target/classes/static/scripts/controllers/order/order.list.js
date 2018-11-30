(function() {
    angular
        .module('app')
        .controller('OrderListCtrl', OrderListCtrl);

    OrderListCtrl.$inject = ['$scope', '$stateParams','$state', '$location', 'SeUtil', '$window', '$http'];

    function OrderListCtrl ($scope, $stateParams, $state, $location, SeUtil, $window, $http) {
        var vm = $scope
        vm.status = "processing"
        if($stateParams.status){
            vm.status = $stateParams.status
        }

        // wx.config({
        //     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        //     appId: '', // 必填，公众号的唯一标识
        //     timestamp: , // 必填，生成签名的时间戳
        //     nonceStr: '', // 必填，生成签名的随机串
        //     signature: '',// 必填，签名
        //     jsApiList: [] // 必填，需要使用的JS接口列表
        // });

        var pramasLit = window.location.search.substring(1).split(/&/)

        var pramas = {}
        for (var i = 0; i < pramasLit.length; i++){
            var r = pramasLit[i].split(/=/)
            if(r.length == 2){
                pramas[r[0]] = r[1]
            }
        }
        var code = pramas.code
        console.log(code)
        if((!vm.app.setting.accessToken ||  (vm.app.setting.expire && moment(vm.app.setting.expire).toDate() < new Date())) && !code && SeUtil.isWechatBrowser()){
            $window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe046330b69c05b15&redirect_uri=http://alextest.nat300.top/%23/orders/list&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
            return
        }
        if(code){
            $http.post(vm.app.host+'/users/wechatAuth', {code: code})
                .success(function (data, header, config, status) {
                    console.info(data);
                    vm.app.setting.accessToken = data.accessToken
                    vm.app.setting.userId = data.userId
                    vm.app.setting.udeskId = data.udeskId
                    vm.app.setting.expire = data.expire
                    console.log("expire")
                    console.log(data.expire)
                    initList()
                })
                .error(function (data, header, config, status) {
                    console.info(data);
                })
        }

        console.log(vm.app.setting.accessToken)

        vm.setStatus = function(status){
            if(status == 'all'){
                vm.list = vm.orders
            }else if(status == 'processing'){
                vm.list = vm.orders.filter(function(item){
                    return item.status != "resolved"
                })
            }else if(status == 'finished'){
                vm.list = vm.orders.filter(function(item){
                    return item.status == "resolved"
                })
            }
        }

        initList()

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
                    vm.orders = data.contents
                    vm.setStatus(vm.status)
                })
            }

        }


    }
})();
