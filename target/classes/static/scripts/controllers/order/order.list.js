(function() {
    angular
        .module('app')
        .controller('OrderListCtrl', OrderListCtrl);

    OrderListCtrl.$inject = ['$scope', '$stateParams','$state', '$location', 'SeUtil', '$window', '$http'];

    function OrderListCtrl ($scope, $stateParams, $state, $location, SeUtil, $window, $http) {
        var vm = $scope

        if (!vm.app.isAuthenticated()) {
            var url = $location.path();
            var from = encodeURIComponent(url);
            $location.path('/signin').search('state=' + from);
        }

        vm.status = "processing"
        if($stateParams.status){
            vm.status = $stateParams.status
        }

        console.log(vm.app.setting.accessToken)

        vm.setStatus = function(status){
            vm.status = status
            if(status == 'all'){
                vm.list = vm.orders
            }else if(status == 'processing'){
                vm.list = vm.orders.filter(function(item){
                    return item.status != "resolved" && item.status != "closed"
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
                    vm.orders = data.contents
                    vm.setStatus(vm.status)
                })
            }

        }

        vm.app.ready(function(){
            initList()
        })

    }
})();
