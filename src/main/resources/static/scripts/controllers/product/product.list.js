(function() {
    angular
        .module('app')
        .controller('ProductListCtrl', ProductListCtrl);

    ProductListCtrl.$inject = ['$scope', '$stateParams','$state', '$location', 'SeUtil', '$window', 'httpService'];

    function ProductListCtrl ($scope, $stateParams, $state, $location, SeUtil, $window, httpService) {
        var vm = $scope
        if (!vm.app.isAuthenticated()) {
            var url = $location.path();
            var from = encodeURIComponent(url);
            $location.path('/signin').search('state=' + from);
        }

        vm.goScore = function(){
            console.log("go score")
            $state.go("score")
        }

        vm.app.ready(function(){
            httpService.getClientProductList(function(r){
                vm.productList = r.productList
            }, function(err){
                console.log(err)
            })
        })

    }
})();
