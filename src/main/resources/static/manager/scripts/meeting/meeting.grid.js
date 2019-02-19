
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
        .controller('MeetingGirdCtrl', MeetingGirdCtrl);


    MeetingGirdCtrl.$inject = ['$scope', '$filter', 'toastr', '$stateParams', 'httpService'];
    function MeetingGirdCtrl ($scope, $filter, toastr, $stateParams, httpService) {

        var vm = $scope;
        vm.earlyDayHours = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00',
            '7:00', '8:00'];
        vm.normalDayHours = ['9:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00', '17:00', '18:00'];
        vm.lateDayHours = ['19:00', '20:00', '21:00', '22:00', '23:00'];
        vm.dayHours = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00',
            '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00',
            '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
            '21:00', '22:00', '23:00'];

        vm.meetingRooms = [];

        vm.maxRoomPerPage = 5;

        vm.selectedMeetingRoom;

        vm.selectedDateText;

        vm.meetingRoomsInPage = [];

        vm.untilDate = new Date();

        // form data used in modal panel in the right
        vm.bookingFormData = {}

        vm.bookingData = [];
        vm.bookingsForCurrentDate;
        vm.currentMouseMoveEvent == null;

        vm.$watch("currentPage", function(newVal, oldVal) {
            console.log('fuck')
            vm.populateMeetingRoomsInPage();
        });

        vm.$watch("selectedDate", function(newVal, oldVal) {
            vm.selectedDateText = $filter('date')(newVal,'yyyy-MM-dd');
            if(!vm.selectedDateText){
                return
            }

            var start = moment(newVal).startOf('day').toDate();
            var end = moment(start).add(1, 'days').toDate();
            pullMeetingOrders(start, end);
        });


        // for testing purposes, use the data returned from API call in production
        vm.getBookingById = function(bookingId) {
            var result = null;
            for (var i=0; i<vm.bookingData.length; i++) {
                var bookingFormData = vm.bookingData[i];
                if (bookingFormData.id == bookingId) {
                    result = bookingFormData;
                    break;
                }
            }
            return result;
        }

        // vm.bookingsForCurrentDate
        vm.getFilteredBookingsByRoom = function(room, result) {
            var filterResult = [];
            for (var i=0; i<result.length; i++) {
                var bookingFormData = result[i];
                if (bookingFormData.meetingRoomName === room.name) {
                    filterResult.push(bookingFormData);
                }
            }
            return filterResult;
        };

        vm.getFilteredBookingsByRoomList = function(roomList, result) {
            var filterResult = [];
            for (var i=0; i<roomList.length; i++) {
                filterResult = filterResult.concat(vm.getFilteredBookingsByRoom(roomList[i], result));
            }
            return filterResult;
        };

        vm.getBookingDataByDate = function(date) {
            var searchResult = [];
            console.log('vm.bookingData')
            console.log(vm.bookingData)
            console.log(date)
            for (var i=0; i<vm.bookingData.length; i++) {
                var bookingFormData = vm.bookingData[i];
                var criteriaDateDisplay = $filter('date')(date,'yyyy-MM-dd');
                var itemDateDisplay = $filter('date')(bookingFormData.meetingDateTime,'yyyy-MM-dd');
                if (criteriaDateDisplay === itemDateDisplay) {
                    searchResult.push(bookingFormData);
                }
            }
            console.log(searchResult)
            console.log('searchResult')
            return searchResult;
        };

        vm.resetTableUI = function() {
            var meetingBodyTable = $("#meetingBodyTable");
            var bookedCell = meetingBodyTable.find("td.booked");
            var bookedDivs = meetingBodyTable.find("div.booked");
            vm.resetCellUI(bookedCell, bookedDivs);
            var notConfirmedCell = meetingBodyTable.find("td.not-confirm");
            var notConfirmedDivs = meetingBodyTable.find("div.not-confirm");
            vm.resetCellUI(notConfirmedCell, notConfirmedDivs);
        };

        vm.resetTableUIForBooking = function(bookingFormData) {
            var cells = $("#meetingBodyTable td[data-booking-id=" + bookingFormData.id + "]");
            var divs = $("#meetingBodyTable div[data-booking-id=" + bookingFormData.id + "]");
            vm.resetCellUI(cells, divs);
        };

        vm.resetCellUI = function(cells, divs) {
            cells.find("div[class=addBtnContainer]").show();
            cells.attr("data-booking-id", "").removeClass('not-confirm').removeClass('booked');
            divs.find('div.infoContainer').hide();
            divs.find('div[class=equipmentContainer]').hide();
            divs.find("div:eq(0)").removeClass("move-up");
            divs.attr("data-booking-id", "").removeClass('not-confirm').removeClass('booked').removeClass('first_cell');
            vm.unbindMouseEnterLeaveEvent(divs);
        };

        vm.refreshTable = function() {
            console.log('refreshTable')
            vm.resetTableUI();

            console.log(vm.bookingsForCurrentDate)
            setTimeout(function() {
                // get the bookings for the selected date and in the current page
                vm.bookingsForCurrentDate = vm.getBookingDataByDate(vm.selectedDate);
                var currentBookings = vm.getFilteredBookingsByRoomList(vm.meetingRoomsInPage, vm.bookingsForCurrentDate);
                console.log('currentBookings')
                console.log(currentBookings)

                for (var i=0; i<currentBookings.length; i++) {
                    console.log('currentBookings')
                    console.log(currentBookings)
                    vm.renderBookingOnTable(currentBookings[i]);
                }
            }, 100);
        };

        vm.populateMeetingRoomsInPage = function() {
            console.log('populateMeetingRoomsInPage')
            var roomPerPage = (vm.meetingRoomList.length < vm.maxRoomPerPage ? vm.meetingRoomList.length : vm.maxRoomPerPage);
            if(!vm.currentPage){
                vm.currentPage = 0
            }
            if(vm.currentPage >= vm.meetingRoomList.length-1){
                vm.hasNext = false
            }else{
                vm.hasNext = true
            }
            if(vm.currentPage == 0){
                vm.hasPrevious = false
            }else{
                vm.hasPrevious = true
            }
            console.log(vm.meetingRoomList.length)
            vm.currentPage = vm.currentPage % vm.meetingRoomList.length;
            var firstIndex = vm.currentPage % vm.meetingRoomList.length;
            if (firstIndex < 0) {
                firstIndex += vm.meetingRoomList.length;
            }

            var meetingRoomsInPage = [];
            var lastIndex = firstIndex + roomPerPage;
            if (lastIndex <= vm.meetingRoomList.length) {
                meetingRoomsInPage = meetingRoomsInPage.concat(vm.meetingRoomList.slice(firstIndex, lastIndex));
                vm.selectedMeetingRoom = vm.meetingRoomList[vm.currentPage].name
            } else {
                console.log(vm.currentPage)
                meetingRoomsInPage = meetingRoomsInPage.concat(vm.meetingRoomList.slice(vm.meetingRoomList.length-roomPerPage, vm.meetingRoomList.length));
                if(vm.meetingRoomList[vm.currentPage]){
                    vm.selectedMeetingRoom = vm.meetingRoomList[vm.currentPage].name
                }
            }

            vm.meetingRoomsInPage = meetingRoomsInPage;

            // refresh table to show bookings on table
            vm.refreshTable();
        };

        vm.nextMeetingRoom = function() {
            vm.currentPage++;
        };

        vm.prevMeetingRoom = function() {
            vm.currentPage--;
        };

        vm.prevMeetingDate = function() {
            var dat = new Date(vm.selectedDate.valueOf());
            dat.setDate(dat.getDate() - 1);
            vm.selectedDate = dat;
            $("#preDateBtn").focus();
        };

        vm.nextMeetingDate = function() {
            var dat = new Date(vm.selectedDate.valueOf());
            dat.setDate(dat.getDate() + 1);
            vm.selectedDate = dat;
        };

        vm.meetingRoomChanged = function() {
            vm.currentPage = vm.meetingRooms.indexOf(vm.selectedMeetingRoom);
        };


        vm.initMeetingGrid = function(callback) {
            vm.meetingRoomList = []
            vm.companyList = []

            httpService.getMeetingRoomList(function(rooms){
                vm.meetingRoomList = rooms
                vm.meetingRoomNames = rooms.map(function(item){
                    return item.name
                })
                console.log(vm.meetingRoomList)
                callback(vm.meetingRoomList)
            }, function(err){
                console.log(err)
            })

            httpService.getAllCompany(function(companies){
                vm.companyList = companies
            }, function(err){
                console.log(err)
            })
        };

        vm.showBookingForm = function() {
            var modalObj = $("#bookingFormModal");
            modalObj.modal("show");
            setTimeout(function() {
                $(".modal-backdrop").on("click", function() {
                    modalObj.find("a[data-dismiss=modal]").click();
                });
            }, 100);
        };

        vm.parseTime = function(timeStr) {
            var isAfternoon = (timeStr.toLowerCase().indexOf("pm") > -1);
            timeStr = timeStr.slice(0, timeStr.length-3);
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
        vm.parseTime24H = function (timeStr) {
            var timeParts = timeStr.split(":");
            var hours = parseInt(timeParts[0]);
            var minutes = parseInt(timeParts[1]);
            var time = new Date();
            time.setHours(hours);
            time.setMinutes(minutes);
            time.setSeconds(0);
            time.setMilliseconds(0);
            return time;
        };

        vm.bookableCellClicked = function(e, dayHours, room, isThirtyMinute) {
            var startTimeText = dayHours;
            if (isThirtyMinute) {
                startTimeText = startTimeText.replace(":00", ":30");
            }
            var meetingTime = vm.parseTime24H(startTimeText);

            vm.bookingFormData = {}
            vm.bookingFormData.meetingRoom = room
            vm.bookingFormData.meetingDate = vm.selectedDate
            vm.bookingFormData.meetingTime = meetingTime
            console.log("bookable:: ", vm.bookingFormData)
            if(moment(meetingTime).hour() == 23){
                vm.bookingFormData.meetingEndTime = moment(meetingTime).hour(23).minute(30).second(0).toDate();
            }else{
                vm.bookingFormData.meetingEndTime = moment(meetingTime).add(1, 'hours').toDate();
            }
            vm.bookingFormData.duration = "1";
            vm.showBookingForm();
        };

        function isBookingInMonth(meetingTime) {
            //var today = moment(new Date()).startOf('day').toDate();
            var now = moment(new Date()).toDate();
            var monthLater = moment(now).add(1, 'months').toDate();
            //var meetingDay = moment(meetingTime).startOf('day').toDate();
            var meetingDay = moment(meetingTime).toDate();
            if (moment(meetingDay).isBefore(moment(now))) {
                return false;
            }
            if (moment(monthLater).isBefore(moment(meetingDay) )) {
                return false;
            }
            return true;
        }

        vm.bookedCellClicked = function(e, dayHours, room, isThirtyMinute) {
            // show modal and populate the existing data to the form
            vm.now = new Date()
            var bookingId = $(e.currentTarget).attr("data-booking-id");
            vm.bookingFormData = vm.getBookingById(bookingId);
            var company = vm.companyList.filter(function(item){
                return item.name == vm.bookingFormData.companyName
            })
            vm.bookingFormData.company = company[0]
            vm.bookingFormData.bookingPeople = vm.bookingFormData.userName
            var room = vm.meetingRoomList.filter(function(item){
                return item.name == vm.bookingFormData.meetingRoomName
            })
            vm.bookingFormData.meetingRoom = room[0]
            //console.info("get bookingForm Data: ", vm.bookingFormData);
            vm.showBookingForm();
        };



        vm.bookTableCellClicked = function(e, dayHours, room, isThirtyMinute) {
            vm.isShowDelete = false;
            var td = $(e.currentTarget);
            if (td.hasClass("booked")) {
                vm.bookedCellClicked(e, dayHours, room, isThirtyMinute);
            } else if (td.hasClass("not-confirm")) {
                vm.bookedCellClicked(e, dayHours, room, isThirtyMinute);
            }else{
                vm.bookableCellClicked(e, dayHours, room, isThirtyMinute);
            }
        };

        vm.addBookingClicked = function() {
            vm.bookingFormData = {};
            vm.bookingFormData.meetingDate = vm.selectedDate;
            /////////harris
            var m = moment(new Date()).minute();
            if (m < 30) {
                vm.bookingFormData.meetingTime = moment(vm.bookingFormData.meetingDate).minute(30).second(0).toDate();
            } else {
                vm.bookingFormData.meetingTime = moment(vm.bookingFormData.meetingDate).add(1, 'hours').minute(0).second(0).toDate();
            }
            if(moment(vm.bookingFormData.meetingTime).hour() == 23){
                vm.bookingFormData.meetingEndTime = moment(vm.bookingFormData.meetingTime).hour(23).minute(30).second(0).toDate();
            }else{
                vm.bookingFormData.meetingEndTime = moment(vm.bookingFormData.meetingTime).add(1, 'hours').toDate();
            }
            vm.bookingFormData.duration = "1";
            /////////
            vm.showBookingForm();
        };

        vm.populateMeetingDateTime = function() {
            vm.bookingFormData.meetingDateTime = new Date();
            vm.bookingFormData.meetingDateTime.setFullYear(vm.bookingFormData.meetingDate.getFullYear());
            vm.bookingFormData.meetingDateTime.setMonth(vm.bookingFormData.meetingDate.getMonth());
            vm.bookingFormData.meetingDateTime.setDate(vm.bookingFormData.meetingDate.getDate());
            vm.bookingFormData.meetingDateTime.setHours(vm.bookingFormData.meetingTime.getHours());
            vm.bookingFormData.meetingDateTime.setMinutes(vm.bookingFormData.meetingTime.getMinutes());
            vm.bookingFormData.meetingDateTime.setSeconds(vm.bookingFormData.meetingTime.getSeconds());
            vm.bookingFormData.meetingDateTime.setMilliseconds(vm.bookingFormData.meetingTime.getMilliseconds());
        };

        vm.moveTooltip = function() {
            var tooltip = $("#booking-tooltip");
            //console.log(tooltip.outerWidth() + ", " + tooltip.outerHeight());
            if (vm.currentMouseMoveEvent == null) {
                return;
            }
            var top = vm.currentMouseMoveEvent.pageY + 5;
            var left = vm.currentMouseMoveEvent.pageX + 5;
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();

            if (left + tooltip.outerWidth() > windowWidth) {
                left = vm.currentMouseMoveEvent.clientX - tooltip.outerWidth() - 5;
            }
            if (top + tooltip.outerHeight() > windowHeight) {
                top = vm.currentMouseMoveEvent.clientY - tooltip.outerHeight() - 5;
            }

            tooltip.css({
                "top": top,
                "left": left
            });
        };

        vm.getMeetingDescription = function(bookingFormData) {
            var endTime = moment(bookingFormData.meetingDateTime).add(bookingFormData.duration, 'hours').toDate();
            var startTimeText = $filter('date')(bookingFormData.meetingDateTime,'H:mm');
            var endTimeText = $filter('date')(bookingFormData.meetingEndTime,'H:mm');
            var bookingDesc = startTimeText + " - " + endTimeText + " (" + bookingFormData.duration + " 小时)";
            return bookingDesc;
        };

        vm.bindMouseEnterLeaveEvent = function(cell) {
            // add mouse enter/leave event on cells
            cell.mouseenter(function(e) {
                //console.log("mouseenter: " + cell.attr("data-booking-id"));
                var bookingId = cell.attr("data-booking-id");
                console.log(bookingId)
                var bookingFormData = vm.getBookingById(bookingId);

                var tooltip = $("#booking-tooltip");
                tooltip.show();
                console.log(bookingFormData)
                tooltip.find(".booking-team").text(bookingFormData.companyName);
                tooltip.find(".booking-people").text(bookingFormData.userName ? bookingFormData.userName : '');
                tooltip.find(".booking-description").text(vm.getMeetingDescription(bookingFormData));

            }).mouseleave(function(e) {
                //console.log("mouseleave: " + cell.attr("data-booking-id"));
                var bookingId = cell.attr("data-booking-id");
                var bookingFormData = vm.getBookingById(bookingId);
                $("#booking-tooltip").hide();
            }).mousemove(function(e) {
                vm.currentMouseMoveEvent = e;
                vm.moveTooltip();
            });
        };

        vm.unbindMouseEnterLeaveEvent = function(cell) {
            cell.unbind('mouseenter');
            cell.unbind('mouseleave');
            cell.unbind('mousemove');
        };

        vm.renderBookingOnTable = function(bookingFormData) {
            console.log('renderBookingOnTable')
            var selectDay = moment(vm.selectedDate).startOf('day').toDate();
            var bookingDay = moment(bookingFormData.meetingDateTime).startOf('day').toDate();
            var days = moment(selectDay).diff(moment(bookingDay), 'days');
            if (days)
                return;
            var selectedDateText = $filter('date')(vm.selectedDate,'yyyy-MM-dd');
            var bookingDateText = $filter('date')(bookingFormData.meetingDateTime,'yyyy-MM-dd');
            var roomIndex = -1
            for(var i=0; i<vm.meetingRoomsInPage.length; i++){
                if(vm.meetingRoomsInPage[i].name == bookingFormData.meetingRoomName){
                    roomIndex = i
                }
            }
            console.log(bookingFormData)
            console.log(vm.meetingRoomsInPage)
            var dateNotCurrent = (selectedDateText !== bookingDateText);
            var roomNotCurrent = (roomIndex < 0);
            console.log('hello world')
            console.log(selectedDateText)
            console.log(bookingDateText)
            console.log(roomIndex)
            if (dateNotCurrent && roomNotCurrent) {
                vm.selectedDate = bookingFormData.meetingDateTime;
                vm.selectedMeetingRoom = bookingFormData.meetingRoom;
                vm.meetingRoomChanged();
                return;
            } else if (dateNotCurrent) {
                vm.selectedDate = bookingFormData.meetingDateTime;
                vm.refreshTable();
                return;
            } else if (roomNotCurrent) {
                vm.selectedMeetingRoom = bookingFormData.meetingRoom;
                vm.meetingRoomChanged();
                return;
            }
            console.log('all current')
            var cellIndex = parseInt(bookingFormData.meetingDateTime.getMinutes() / 15);
            var cellNum = bookingFormData.duration / 0.25;
            console.log(cellIndex)
            console.log(cellNum)
            //var cellNum = parseFloat(bookingFormData.duration).toFixed(1) / 0.5;
            var meetingBodyTable = $("#meetingBodyTable");
            for (var i=0; i<cellNum; i++){
                var startfifteen = cellIndex%2;
                var fifteenIndex = (cellIndex + i) % 4;
                var currentRoomIndex = fifteenIndex < 2 ? roomIndex+1 : roomIndex;
                var startTimeIndex = moment(bookingFormData.meetingDateTime).add(i * 15, "minutes").toDate().getHours() * 2 + (fifteenIndex >= 2 ? 1 : 0);
                var isfifteen = (fifteenIndex % 2 == 1) ? 1 : 0;
                var currentTd = meetingBodyTable.find("tr:eq(" + startTimeIndex + ") > td:eq(" + currentRoomIndex + ")");
                var currentDiv = meetingBodyTable.find("tr:eq(" + startTimeIndex + ") > td:eq(" + currentRoomIndex + ") > div:eq(1) > div:eq("+isfifteen+")");
                currentDiv.removeClass('not-confirm');
                currentDiv.addClass('booked');
                currentTd.removeClass('not-confirm');
                currentTd.addClass('booked');

                //currentTd.addClass('booked');
                currentDiv.attr('data-booking-id', bookingFormData.id);
                currentTd.attr('data-booking-id', bookingFormData.id);
                currentTd.find('div[class=addBtnContainer]').hide();
                if(i == 0){
                    currentDiv.addClass('first_cell')
                }
                if(bookingFormData.duration > 0.25){
                    if (i == 1) {
                        currentDiv.find('div[class=infoContainer]').show();
                        //currentDiv.find('img.logo').attr("src", bookingFormData.logo  + '?x-oss-process=image/resize,m_fixed,h_20,w_20');
                        currentDiv.find("div:eq(0)").addClass("move-up");

                        var companyName = bookingFormData.companyName;
                        if(bookingFormData.companyName > 7){
                            companyName = bookingFormData.companyName.substring(0,7)+"..."
                        }
                        currentDiv.find('span.teamText').text(companyName);
                    }
                }else {
                    if (i == 0) {
                        currentDiv.find('div[class=infoContainer]').show();
                        //currentDiv.find('img.logo').attr("src", bookingFormData.logo + '?x-oss-process=image/resize,m_fixed,h_20,w_20');
                        var companyName = bookingFormData.companyName;
                        if (bookingFormData.companyName > 8) {
                            companyName = bookingFormData.companyName.substring(0, 8)+"..."
                        }
                        currentDiv.find('span.teamText').text(companyName);
                    }
                }
                vm.bindMouseEnterLeaveEvent(currentDiv);
            }

        };


        function updateMeetingOrder(callback) {
            var meetingTime = moment(vm.bookingFormData.meetingTime);
            var meetingStartDate = moment(vm.bookingFormData.meetingDate).hour(meetingTime.hour()).minute(meetingTime.minute()).second(0).millisecond(0).toDate();
            var meetingEndDate = moment(vm.bookingFormData.meetingDate).hour(moment(vm.bookingFormData.meetingEndTime).hour()).minute(moment(vm.bookingFormData.meetingEndTime).minute()).second(0).millisecond(0).toDate();
            //console.log("get start Time: ", meetingStartDate);

            var meetingOrder = {
                start: meetingStartDate,
                end: meetingEndDate,
                topic: vm.bookingFormData.subject,
                notes: vm.bookingFormData.description
            };
            var team = undefined;
            var room = undefined;
            if (vm.bookingFormData.meetingRoom) {
                for (var i = 0; i < vm.meetingRoomsObj.length; i++) {
                    if (vm.meetingRoomsObj[i].externalId == vm.bookingFormData.meetingRoom || vm.meetingRoomsObj[i].name == vm.bookingFormData.meetingRoom) {
                        console.log("find meeting room ok");
                        meetingOrder.roomId = vm.meetingRoomsObj[i].id;
                        room = vm.meetingRoomsObj[i];
                        break;
                    }
                }
            }
            if (vm.bookingFormData.team) {
                for (var i = 0; i < vm.teamsObj.length; i++) {
                    if (vm.teamsObj[i].name == vm.bookingFormData.team) {
                        meetingOrder.teamId = vm.teamsObj[i].id;
                        team = vm.teamsObj[i];
                        break;
                    }
                }
            }
            meetingOrder.confirmed = vm.bookingFormData.confirmedIt == false ? false: true;

            Meeting.prototype$updateAttributes({id: vm.bookingFormData.id}, meetingOrder, function (meeting, res) {
                //console.log("update meeting order: ", meeting);
                meeting.team = team;
                meeting.room = room;
                var modalObj = $("#bookingFormModal").modal("hide");
                console.log("update meeting order ok");
                callback(meeting);
            }, function (err) {
                if (err.status == 409) {
                    toastr.error('与已有会议时间冲突');
                } else if (err.status == 414){
                    toastr.error('会议结束时间必须大于开始时间');
                }else{
                    toastr.error('更新会议信息失败');
                }
                console.log("update meeting order failed");
                console.log(err);
            });
        }

        $scope.resetEndDate = function(){
            var meetingTime = moment(vm.bookingFormData.meetingTime);
            var meetingStartDate = moment(vm.bookingFormData.meetingDate).hour(meetingTime.hour()).minute(meetingTime.minute()).second(0).toDate();
            var minutes = moment(vm.bookingFormData.meetingEndTime).diff(meetingStartDate, 'minutes');
            var duration = minutes/60;
            vm.bookingFormData.duration = duration;
        };

        function createMeetingOrder(callback) {
            var meetingTime = moment(vm.bookingFormData.meetingTime);
            var meetingStartDate = moment(vm.bookingFormData.meetingDate).hour(meetingTime.hour()).minute(meetingTime.minute()).second(0).millisecond(0).toDate();
            var meetingEndDate = moment(vm.bookingFormData.meetingDate).hour(moment(vm.bookingFormData.meetingEndTime).hour()).minute(moment(vm.bookingFormData.meetingEndTime).minute()).second(0).millisecond(0).toDate();
            var meetingOrder = {
                start: meetingStartDate,
                end: meetingEndDate,
                topic: vm.bookingFormData.subject,
                notes: vm.bookingFormData.description
            };
            var team = undefined;
            var room = undefined;
            if (vm.bookingFormData.meetingRoom) {
                for (var i = 0; i < vm.meetingRoomsObj.length; i++) {
                    if (vm.meetingRoomsObj[i].externalId == vm.bookingFormData.meetingRoom || vm.meetingRoomsObj[i].name == vm.bookingFormData.meetingRoom) {
                        console.log("find meeting room ok");
                        room = vm.meetingRoomsObj[i];
                        meetingOrder.roomId = vm.meetingRoomsObj[i].id;
                        break;
                    }
                }
            }
            if (vm.bookingFormData.team) {
                for (var i = 0; i < vm.teamsObj.length; i++) {
                    if (vm.teamsObj[i].name == vm.bookingFormData.team) {
                        meetingOrder.teamId = vm.teamsObj[i].id;
                        team = vm.teamsObj[i];
                        break;
                    }
                }
            }
            meetingOrder.equipmentsReturn = false;
            (function (team, meetingRoom) {
                Meeting.create(meetingOrder, function (meeting, res) {
                    console.log("create meeting order ok");
                    meeting.team = team;
                    meeting.room = meetingRoom;
                    $("#bookingFormModal").modal("hide");
                    callback(meeting);
                }, function (err) {
                    if (err.status == 409) {
                        toastr.error('与已有会议时间冲突');
                    } else if (err.status == 414){
                        toastr.error('会议结束时间必须大于开始时间');
                    }else{
                        toastr.error('创建会议信息失败');
                    }
                    console.log("create meeting order failed");
                    console.log(err);
                });
            })(team, room);
        }

        vm.deleteBookingCb = function () {
            console.log("delete booking cb");
            httpService.deleteMeeting(vm.bookingFormData.id, function(){
                for (var j = 0; j < vm.bookingData.length; j++) {
                    if (vm.bookingData[j].id == vm.bookingFormData.id) {
                        console.log("delte will be execute!!!!");
                        vm.bookingData.splice(j, 1);
                        vm.resetTableUIForBooking(vm.bookingFormData);
                        var modalObj = $("#bookingFormModal");
                        modalObj.modal("hide");
                    }
                }
            }, function(err){
                toastr.error('删除会议失败')
            })
        }

        // vm.terminateMeeting = function(){
        //     var tDate = new Date()
        //     var min = tDate.getMinutes()
        //     if(min < 15){
        //         tDate.setMinutes(15)
        //         tDate.setSeconds(0)
        //         tDate.setUTCMilliseconds(0)
        //     }else if(min < 30){
        //         tDate.setMinutes(30)
        //         tDate.setSeconds(0)
        //         tDate.setUTCMilliseconds(0)
        //     }else if(min < 45){
        //         tDate.setMinutes(45)
        //         tDate.setSeconds(0)
        //         tDate.setUTCMilliseconds(0)
        //     }else{
        //         tDate.setMinutes(0)
        //         tDate.setSeconds(0)
        //         tDate.setUTCMilliseconds(0)
        //         tDate = moment(tDate).add(1, 'hours').toDate()
        //     }
        //
        //     Meeting.prototype$updateAttributes({id: vm.bookingFormData.id}, {end: tDate}, function(result){
        //         vm.bookingFormData.meetingEndTime = tDate
        //         var minutes = moment(vm.bookingFormData.meetingEndTime).diff(vm.bookingFormData.meetingTime, 'minutes');
        //         var duration = minutes/60;
        //         vm.bookingFormData.duration = duration
        //         for (var j = 0; j < vm.bookingData.length; j++) {
        //             if (vm.bookingData[j].id == vm.bookingFormData.id) {
        //                 console.log("delte will be execute!!!!");
        //                 vm.bookingData.splice(j, 1);
        //                 vm.resetTableUIForBooking(vm.bookingFormData);
        //                 var modalObj = $("#bookingFormModal");
        //                 modalObj.modal("hide");
        //                 vm.clearLeadGoods();
        //             }
        //         }
        //         vm.renderBookingOnTable(vm.bookingFormData);
        //         toastr.success("提前结束成功");
        //     }, function(err){
        //         toastr.error("提前结束失败");
        //         console.info(err)
        //     })
        // }

        vm.confirmBookingClicked = function(confirm) {

            if(!vm.bookingFormData.company){
                toastr.error("请选择公司");
                return;
            }
            if(!vm.bookingFormData.meetingRoom){
                toastr.error("请选择会议室");
                return;
            }
            console.log('vm.bookingFormData')
            console.log(vm.bookingFormData)

            vm.populateMeetingDateTime()
            var meetingTime = moment(vm.bookingFormData.meetingTime);
            var meetingStartDate = moment(vm.bookingFormData.meetingDate).hour(meetingTime.hour()).minute(meetingTime.minute()).second(0).millisecond(0).toDate();
            var meetingEndDate = moment(vm.bookingFormData.meetingDate).hour(moment(vm.bookingFormData.meetingEndTime).hour()).minute(moment(vm.bookingFormData.meetingEndTime).minute()).second(0).millisecond(0).toDate();
            var newMeeting = {
                companyId: vm.bookingFormData.company.id,
                companyName: vm.bookingFormData.company.name,
                userName: vm.bookingFormData.bookingPeople,
                start: moment(meetingStartDate).format('YYYY-MM-DD HH:mm:ss'),
                end: moment(meetingEndDate).format('YYYY-MM-DD HH:mm:ss'),
                topic: vm.bookingFormData.topic,
                remark: vm.bookingFormData.remark,
                meetingRoomId: vm.bookingFormData.meetingRoom.id,
                meetingRoomName: vm.bookingFormData.meetingRoom.name,
                channel: "manager"
            }

            if(vm.bookingFormData.id){
                newMeeting.id = vm.bookingFormData.id
            }

            httpService.upsertMeeting(newMeeting, function(meeting){
                if(!newMeeting.id){
                    pushBookingData([meeting]);
                    vm.bookingFormData = vm.bookingData[vm.bookingData.length-1];
                    vm.renderBookingOnTable(vm.bookingFormData)
                    var modalObj = $("#bookingFormModal").modal("hide");
                    return
                }
                for (var i = 0; i < vm.bookingData.length; i++) {
                    if (vm.bookingData[i].id == meeting.id) {
                        vm.bookingData.splice(i, 1);
                        pushBookingData([meeting]);
                        vm.bookingFormData = vm.bookingData[vm.bookingData.length-1];
                        vm.resetTableUIForBooking(vm.bookingFormData);
                        setTimeout(function() {
                            vm.renderBookingOnTable(vm.bookingFormData);
                        }, 100);
                        var modalObj = $("#bookingFormModal").modal("hide");
                    }
                }
            }, function(err){
                console.log(err)
                toastr.error('保存会议失败')
            })


            // var bookingForm = $("#bookingForm");
            // if (bookingForm[0].checkValidity()) {
            //
            //     if (typeof(vm.bookingFormData.company) === "undefined"
            //         || vm.bookingFormData.team === null) {
            //         toastr.error("请选择团队");
            //         return;
            //     }
            //     if (typeof(vm.bookingFormData.meetingRoom) === "undefined"
            //         || vm.bookingFormData.meetingRoom === null) {
            //         toastr.error("请选择会议室");
            //         return;
            //     }
            //
            //     vm.populateMeetingDateTime();
            //
            //     var isNew = false;
            //     if (typeof(vm.bookingFormData.id) === "undefined" ||
            //         vm.bookingFormData.id === null) {
            //         isNew = true;
            //     }
            //
            //     ///////<<<<harris
            //     if (isNew) {
            //         createMeetingOrder(function (meeting) {
            //             if (!meeting.team || !meeting.room)
            //                 return;
            //             //console.log(meeting);
            //             pushBookingData([meeting]);
            //             vm.bookingFormData = vm.bookingData[vm.bookingData.length-1];
            //             vm.renderBookingOnTable(vm.bookingFormData);
            //         });
            //     } else {
            //         vm.bookingFormData.confirmedIt = confirm;
            //         updateMeetingOrder(function (meeting) {
            //             for (var i = 0; i < vm.bookingData.length; i++) {
            //                 if (vm.bookingData[i].id == meeting.id) {
            //                     vm.bookingData.splice(i, 1);
            //                     if (!meeting.team || !meeting.room)
            //                         return;
            //                     //console.log(meeting);
            //                     //console.log("update meeting duration::: ", meeting.duration);
            //                     pushBookingData([meeting]);
            //                     vm.bookingFormData = vm.bookingData[vm.bookingData.length-1];
            //                     vm.resetTableUIForBooking(vm.bookingFormData);
            //
            //                     setTimeout(function() {
            //                         vm.renderBookingOnTable(vm.bookingFormData);
            //                     }, 100);
            //                 }
            //             }
            //         });
            //     }
            // }
        };

        vm.fitTableHeight = function() {
            var windowHeight = $(window).height();
            $("#meetingBodyTableWrapper").css("height", windowHeight-250);
        };

        function pushBookingData(meetings) {
            for (var i = 0; i < meetings.length; i++) {
                var bFind = false;
                for (var j = 0; j < vm.bookingData.length; j++) {
                    if (vm.bookingData[j].id == meetings[i].id) {
                        bFind = true;
                        break;
                    }
                }
                if (bFind)
                    continue;

                var fakeBooking = {
                    id: meetings[i].id,
                    meetingDate: moment(meetings[i].start).toDate(),
                    meetingTime: moment(meetings[i].start).toDate(),
                    meetingDateTime: moment(meetings[i].start).toDate(),
                    meetingEndTime: moment(meetings[i].end).toDate(),
                    duration: 1,
                    topic: meetings[i].topic,
                    remark: meetings[i].remark
                }
                if(meetings[i].userName){
                    fakeBooking.userName = meetings[i].userName
                }
                if (meetings[i].companyName) {
                    fakeBooking.companyName = meetings[i].companyName
                }
                if (meetings[i].meetingRoomName) {
                    fakeBooking.meetingRoomName = meetings[i].meetingRoomName
                }
                var m = moment(meetings[i].end).diff(moment(meetings[i].start), 'minutes');
                fakeBooking.duration = (m/60)+""

                vm.bookingData.push(fakeBooking)
            }
            vm.refreshTable();
        }

        function pullMeetingOrders(start, end) {
            httpService.getMeeting({
                start: moment(start).format('YYYY-MM-DD HH:ss:mm'),
                end: moment(end).format('YYYY-MM-DD HH:ss:mm')
            }, function(meetings){
                pushBookingData(meetings)
            }, function(err){
                console.log(err)
            })
        }

        vm.scrollToNine = function() {
            // scroll to 9:00 by default
            setTimeout(function() {
                var meetingBodyTableWrapper = $("#meetingBodyTableWrapper")
                var nineCellTop = $("#meetingBodyTable td").filter(function(){
                    return $(this).text() === '9:00';
                }).offset().top
                var wrapperTop = meetingBodyTableWrapper.offset().top
                meetingBodyTableWrapper.scrollTop(nineCellTop - wrapperTop)
            }, 100)
        };

        // init page
        vm.initPage = function() {
            vm.populateMeetingRoomsInPage()
            vm.selectedMeetingRoom = vm.meetingRoomList[0].name
            vm.selectedDate = new Date()
            var start = moment(vm.selectedDate).startOf('days').toDate()
            var end = moment(start).add(1, 'days').subtract(1, 'minutes').toDate()
            vm.scrollToNine()

            $(function() {
                $('#bookingForm').submit(function(event){
                    // cancels the form submission
                    event.preventDefault();
                });

                vm.fitTableHeight();

                $( window ).resize(function() {
                    vm.fitTableHeight();
                });
            });
        };

        vm.initMeetingGrid(vm.initPage);

    }
})();
