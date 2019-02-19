/**
 * Created by harris on 16/8/30.
 */
(function() {
    angular
        .module('app')
        .config(function(toastrConfig) {
            angular.extend(toastrConfig,
                {positionClass: 'toast-top-full-width',
                    preventOpenDuplicates: true,
                    timeOut: 1000,
                });
        })
        .controller('MeetingRoomListCtrl', MeetingRoomListCtrl);

    MeetingRoomListCtrl.$inject = ['$scope', 'toastr', 'httpService'];

    function MeetingRoomListCtrl($scope, toastr, httpService) {

        var vm = $scope;

        function getMeetingRoomList() {
            $scope.meetingRooms = [];
            httpService.getMeetingRoomList(function(rooms){
                $scope.meetingRooms = rooms
            }, function(err){
                console.log(err)
            })
        }

        getMeetingRoomList();

        $scope.deleteRoomBtn = function (meetingRoom, index) {
            $scope.deleteRoom = meetingRoom;
        };
        $scope.deleteMeetingRoom = function () {
            if (!$scope.deleteRoom)
                return;
            httpService.deleteMeetingRoom($scope.deleteRoom.id, function(err){
                getMeetingRoomList()
                $('#m-delete').modal('hide')
            }, function(err){
                console.log(err)
                toastr.error('删除失败')
            })
        };


        vm.editMeetingRoom = function (meetingRoom) {
            $scope.Form.$setPristine();
            if(meetingRoom){
                $scope.meetingRoom = meetingRoom
            }else{
                $scope.meetingRoom = {externalId: '', name: '', seatNum: 0}
            }
        };


        $scope.saveMeetingRoom = function () {
            if(!$('#nameInput').hasClass('ng-valid')){
                toastr.error("请输入会议室名称");
                $('#nameInput').addClass('ng-dirty');
                $('#nameInput').addClass('ng-invalid');
                return;
            }

            $scope.completeLoading = true
            httpService.upsertMeetingRoom($scope.meetingRoom, function(){
                $scope.completeLoading = false
                getMeetingRoomList()
                $('#m-edit').modal('hide')
            }, function(err){
                $scope.completeLoading = false
                toastr.error('保存失败')
            })
        };
    }
})();
