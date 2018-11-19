(function() {
    angular
        .module('app')
        .controller('ScoreListCtrl', ScoreListCtrl);

    ScoreListCtrl.$inject = ['$scope', '$stateParams','$state', '$location', 'SeUtil', '$window', 'httpService'];

    function ScoreListCtrl ($scope, $stateParams, $state, $location, SeUtil, $window, httpService) {
        var vm = $scope

        vm.app.ready(function(){
            httpService.getScoreList(function(r){
                vm.scoreList = r
            }, function(err){
                console.log(err)
            })
        })

    }
})();
