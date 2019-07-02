(function() {
    angular
        .module('app')
        .controller('MeetingRoomCtrl', MeetingRoomCtrl);
    MeetingRoomCtrl.$inject = ['$scope','$state', 'httpService', '$stateParams', '$http', '$interval'];

    function MeetingRoomCtrl ($scope, $state, httpService, $stateParams, $http, $interval) {
        var vm =  $scope

        vm.index = 0

        $http({
            method: 'get',
            //url: 'http://localhost:3000/api/meetingRooms/'+ $stateParams.id,
            url: 'http://jcservice.nat300.top/api/meetingRooms',
            headers: {'Content-Type': 'application/json'}
        }).success(function (r, header, config, status) {
            console.log(r)
            vm.rooms = r
            var timer = $interval(function(){
                fetchData(vm.index)
                if(vm.index < vm.rooms.length-1){
                    vm.index ++
                }else{
                    vm.index = 0
                }
            },5000)
        }).error(function (r, header, config, status) {
            console.log(r)
        })

        $('#site-landing').polygonizr({
            nodeMovementDistance: 200,
            numberOfNodes: 210,
            numberOfNodes: 55,
            nodeDotSize: 5.5,
            nodeDotColor: "3, 206, 253",
            nodeLineColor: "2, 66, 235",
            nodeFillAlpha: 0
        });

        function fetchData(index) {
            console.log('loop')
            vm.dateString = moment(new Date()).format('YYYY-MM-DD HH:mm')
            vm.name =vm.rooms[index].name
            $http({
                method: 'get',
                //url: 'http://localhost:3000/api/meetings/meetingRoom/'+ $stateParams.id,
                url: 'http://jcservice.nat300.top/api/meetings/meetingRoom/'+ vm.rooms[index].id,
                headers: {'Content-Type': 'application/json'}
            }).success(function (r, header, config, status) {
                console.log(r)
                vm.meetings = r
            }).error(function (r, header, config, status) {
                console.log(r)
            })
        }



    }

})();
