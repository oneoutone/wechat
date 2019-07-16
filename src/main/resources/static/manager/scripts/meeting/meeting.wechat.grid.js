(function() {
    angular
        .module('app')
        .controller('MeetingWechatGirdCtrl', MeetingWechatGirdCtrl);

    MeetingWechatGirdCtrl.$inject = ['$scope', '$element', '$state', '$stateParams', 'httpService'];


    function MeetingWechatGirdCtrl($scope, $element, $state, $stateParams, httpService) {


        if ($stateParams.back) {
            $element.addClass("back")
        }

        $scope.$on('$viewContentAnimationEnded', function () {
            $element.removeClass("back");
        });

        $scope.$on("uiBack", function (event, args) {
            $element.addClass("back");
        });

        var vm = $scope;
        if($stateParams.buildingId){
            vm.buildingId = $stateParams.buildingId
        }else{
            vm.buildingId = 198284
        }

        vm.clickable = true;
        //table scroll：控制X轴和Y轴滚动条
        cDiv.onscroll=function(){
            tb2.style.left  = cDiv.scrollLeft*-1 +'px';
            tb3.style.top  = cDiv.scrollTop*-1 +'px';
            var index = parseInt((cDiv.scrollLeft+2)/((window.screen.width - 80) / 2));
            if(!vm.meetingRooms || vm.meetingRooms.lengrh == 0){
                return
            }
            if(vm.selectedMeetingRoom != vm.meetingRooms[index].id){
                vm.selectedMeetingRoom = vm.meetingRooms[index].id;
                $("#sel").val(vm.meetingRooms[index].id);
            }
        };

        vm.minDate = moment(new Date()).startOf("days").subtract(1, 'month').toDate();
        vm.maxDate = moment(new Date()).add(1, 'months').startOf("days").toDate();

        vm.earlyDayHours = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00',
            '7:00', '8:00'
        ];
        vm.normalDayHours = ['9:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00', '17:00', '18:00'
        ];
        vm.lateDayHours = ['19:00', '20:00', '21:00', '22:00', '23:00'];
        vm.dayHours = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00',
            '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
            '21:00', '22:00', '23:00'
        ];

        vm.meetingRooms = [];

        vm.selectedMeetingRoom;

        // form data used in modal panel in the right
        vm.bookingFormData = {
        };

        vm.bookingData = [];
        vm.bookingsForCurrentDate;
        vm.currentMouseMoveEvent == null;

        vm.meetingRoomChanged = function() {
            for(var k= 0; k<vm.meetingRooms.length; k++){
                if(vm.meetingRooms[k].id ==  vm.selectedMeetingRoom){
                    var index = 0;
                    if(vm.meetingRooms.length > 1){
                        index = ((k==vm.meetingRooms.length-1) ? (k-1) : (k))
                    }
                    $("#cDiv").scrollLeft((window.screen.width-80)/2*index);
                }
            }
        };

        /////////////////////////////////////////////////
        ///////////////harris////////////////////////////
        /////////////////////////////////////////////////
        vm.initMeetingGrid = function(callback) {
            getMeetings(callback);
        };

        function getMeetings(callback){
            httpService.getMeetingRoomByBuildingId({buildingId: vm.buildingId}, function(rooms){
                vm.meetingRooms = rooms
                var scrollLength = vm.meetingRooms.length * (window.screen.width - 80) / 2;
                vm.scrollLength = scrollLength;
                $(document).ready(function(){
                    $("#tb2").css("width",scrollLength);
                    $("#tb4").css("width",scrollLength);
                });
                callback();
            }, function(err){
                vm.meetingRooms = [];
                callback();
            })
        }

        vm.parseTime = function(timeStr) {
            var isAfternoon = (timeStr.toLowerCase().indexOf("pm") > -1);
            timeStr = timeStr.slice(0, timeStr.length - 3);
            var timeParts = timeStr.split(":");
            var hours = parseInt(timeParts[0]);
            var minutes = parseInt(timeParts[1]);
            if (isAfternoon) {
                if (hours !== 12) {
                    hours += 12;
                }
            } else {
                if (hours === 12) {
                    hours = 0;
                }
            }
            var time = new Date();
            time.setHours(hours);
            time.setMinutes(minutes);
            time.setSeconds(0);
            time.setMilliseconds(0);
            return time;
        };
        vm.parseTime24H = function(timeStr) {
            var timeParts = timeStr.split(":");
            var hours = parseInt(timeParts[0]);
            var minutes = parseInt(timeParts[1]);
            var time = vm.selectedDate;
            time.setHours(hours);
            time.setMinutes(minutes);
            time.setSeconds(0);
            time.setMilliseconds(0);
            return time;
        };

        vm.bookableCellClicked = function(e, dayHours, room, isThirtyMinute) {
            if(!$scope.clickable){ return }
            var startTimeText = dayHours;

            if (isThirtyMinute) {
                startTimeText = startTimeText.replace(":00", ":30");
            }
            var meetingTime = vm.parseTime24H(startTimeText);
            var isBookable = isBookingInMonth(meetingTime);
            if (!isBookable) {
                $scope.showMe();
                var td = $(e.currentTarget);
                td.removeClass('bookable-hover-effect');
                return;
            }

            var meeingsInSameRoom = vm.meetings.filter(function (item) {
                return room.id === item.roomId;
            });

            var meetingEndTime = moment(meetingTime).add(1, "hours").toDate();

            for(var i=0; i<meeingsInSameRoom.length; i++){
                var start = new Date(meeingsInSameRoom[i].start);
                var end = new Date(meeingsInSameRoom[i].end);
                if(start > meetingTime && start <meetingEndTime){
                    meetingEndTime = start
                }
                if(start > meetingTime && start <meetingEndTime){
                    meetingTime == end
                }
            }

            var param = {
                "meetingRoom": room.id,
                "meetingTime":meetingTime,
                "meetingEndTime": meetingEndTime
            };
            console.info("going");
            $state.go("wechatMeeting.info", {param : param, offsetx: cDiv.scrollLeft, offsety: cDiv.scrollTop, buildingId: vm.buildingId});

        };

        vm.bookedCellClicked = function(meeting) {
            if(!$scope.clickable){ return }
            if (!vm.currentTeam) return;
            if(meeting.organizerId === User.getCurrentId()){
                $state.go("wechatMeeting.info", {"param" : {id: meeting.id}, id: meeting.id, "offsety": cDiv.scrollTop, "offsetx": cDiv.scrollLeft, buildingId: vm.buildingId});
                return
            }
            if(meeting.confirmed === false && (vm.app.roles.executive || vm.app.roles.admin)){
                $state.go("wechatMeeting.info", {"param" : {id: meeting.id}, id: meeting.id, "offsety": cDiv.scrollTop, "offsetx": cDiv.scrollLeft, buildingId: vm.buildingId});
            }
        };

        vm.bookTableCellClicked = function(e, dayHours, room, isThirtyMinute) {
            console.info("bookTableCellClicked");
            console.info($scope.clickable);
            if(!$scope.clickable){ return }
            if (!vm.selectedDate) {
                vm.selectedDate = moment(new Date()).add(1, "months").startOf("days").toDate();
            }
            vm.bookableCellClicked(e, dayHours, room, isThirtyMinute);
        };


        function isBookingInMonth(meetingTime) {
            var now = new Date();
            if (now.getMinutes() > 30) now.setMinutes(30);
            else now.setMinutes(0);
            now.setSeconds(0);
            var today = moment(new Date()).startOf('day').toDate();
            var monthLater = moment(today).add(1, 'months').toDate();
            var delta = moment(meetingTime).diff(now, 'minutes');
            if (delta < 0) {
                return false;
            }
            if (moment(monthLater).isBefore(moment(meetingTime) )) {
                return false;
            }
            return true;
        }

        $scope.showMe = function(){
            $('#dateOutRangeTip').fadeIn(200)
        };

        $scope.hideMe = function(){
            $('#dateOutRangeTip').fadeOut(200)
        };

        function pushBookingData(meetings) {
            $scope.meetings = [];
            for (var i = 0; i < meetings.length; i++) {
                meetings[i].duration = moment(meetings[i].end).diff(moment(meetings[i].start), 'minutes')/15;
                var thour = moment(meetings[i].start).toDate().getHours();
                var tminute = moment(meetings[i].start).toDate().getMinutes()/15;
                var index = -1;
                for(var k= 0; k<vm.meetingRooms.length; k++){
                    if(vm.meetingRooms[k].id ==  meetings[i].meetingRoomId){
                        index = k;
                        break;
                    }
                }
                if(thour*4+tminute+meetings[i].duration > 96){
                    meetings[i].duration = 96-thour*4-tminute
                }

                meetings[i].style = {
                    "position" : "absolute",
                    "background-color": meetings[i].confirmed == false ? "#f4c55e" : "#f44355",
                    "left" : (index*(window.screen.width-80)/2)+"px",
                    "top" : (thour*68+tminute*17+1)+"px",
                    "height" : (meetings[i].duration*17-1) + "px",
                    "width" : ((window.screen.width-80)/2-1) +"px",
                    "font-size": meetings[i].duration==1? 12+"px" : 14+"px"
                };

                meetings[i].textStyle = {
                    "padding-top": (meetings[i].duration > 1 ? "10px" : "0px"),
                };

                meetings[i].imageStyle = {
                    "width": (meetings[i].duration > 1 ? "20px" : "12px"),
                    "height": (meetings[i].duration > 1 ? "20px" : "12px"),
                    "vertical-align": "middle"
                }
            }
            $scope.meetings = meetings;
        }


        function pullMeetingOrders(start, end) {
            if(!vm.meetingRooms || vm.meetingRooms.length == 0){
                return
            }
            var roomIds = [];
            for(var i=0; i< vm.meetingRooms.length; i++){
                roomIds.push(vm.meetingRooms[i].id)
            }
            httpService.getMeetingByBuildingId({buildingId: vm.buildingId,
                start: moment(start).format('YYYY-MM-DD HH:ss:mm'),
                end: moment(end).format('YYYY-MM-DD HH:ss:mm')
            }, function(meetings){
                pushBookingData(meetings)
            }, function(err){
                console.log(err)
            })
        }

        function scrollToOffset(time, offsetx, offsety){
            var x= offsetx ? offsetx : 0;
            if(!time && !offsety){
                return
            }
            if(!time){
                setTimeout(function() {
                    $("#cDiv").scrollTop(offsety);
                    $("#cDiv").scrollLeft(x);
                }, 100);
                return
            }
            if(time<1){
                time = 0
            }else if(time >= 16){
                time = 16
            }else{
                time = time-1
            }
            setTimeout(function() {
                $("#cDiv").scrollTop(time*68);
                $("#cDiv").scrollLeft(x);
            }, 100);
            console.info("time",time)
        }

        // init page
        vm.initPage = function() {
            if ($stateParams.param == null) {
                if(vm.meetingRooms && vm.meetingRooms.length > 0){
                    vm.selectedMeetingRoom = vm.meetingRooms[0].id;
                    vm.selectedDate = new Date();
                }
            } else {
                vm.selectedMeetingRoom = $stateParams.param.selectedMeetingRoom;
                vm.selectedDate = $stateParams.param.selectedDate;
                vm.meetingRoomChanged();
            }

            var start = moment(vm.selectedDate).startOf('day').toDate();
            vm.start = start;
            var end = moment(vm.selectedDate).add(1, 'days').subtract(1, 'minutes').toDate();
            vm.end = end;

            $('#selectedDateInput').val(moment(vm.selectedDate).format("MM月DD日"));
            $scope.endPicker = mobiscroll.date('#selectedDateInput', {
                theme: 'mobiscroll',
                display: 'bottom',
                lang: 'zh',
                closeOnOverlayTap: true,
                showLabel: true,
                min: vm.minDate,
                max: vm.maxDate,
                onClose: function(event, inst){
                    var date = new Date($scope.endPicker.getVal());
                    $('#selectedDateInput').val(moment(date).format("MM月DD日"));
                    var start = moment(date).startOf('day').toDate();
                    vm.start = start;
                    var end = moment(start).add(1, 'days').subtract(1, 'minutes').toDate();
                    vm.end = end;
                    vm.selectedDate = start;
                    pullMeetingOrders(start, end);
                }
            });

            if($stateParams.time || $stateParams.offsetx || $stateParams.offsety){
                scrollToOffset($stateParams.time, $stateParams.offsetx, $stateParams.offsety)
            }else{
                scrollToOffset(10)
            }

            var start = moment(vm.selectedDate).startOf('days').toDate();
            var end = moment(start).add(1, 'days').subtract(1, 'minutes').toDate();
            pullMeetingOrders(start, end);
        };

        vm.initMeetingGrid(vm.initPage)
    }

})();
