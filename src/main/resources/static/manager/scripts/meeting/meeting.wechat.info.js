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
        .controller('BookingWechatFormCtrl', BookingWechatFormCtrl);
    BookingWechatFormCtrl.$inject = ['$scope', '$location', '$filter', '$element', '$state', '$stateParams', '$window', 'toastr', '$timeout', 'httpService'];


    function BookingWechatFormCtrl($scope, $location, $filter, $element, $state, $stateParams, $window, toastr, $timeout, httpService) {


        $scope.$on("uiBack", function (event, args) {
            $('.mbsc-ios').hide();
            $element.addClass("back");
        });
        console.log("get bookingId: ", $stateParams.id);

        var vm = $scope;
        vm.buildingId = $stateParams.buildingId

        vm.bookingFormData ={};

        vm.fecthMeeting =function(){
            console.log("meeting room start")
            console.log($stateParams.param.meetingRoom)
            vm.bookingFormData.meetingRoom = $stateParams.param.meetingRoom+'';
            vm.bookingFormData.meetingDateTime = $stateParams.param.meetingTime;
            vm.bookingFormData.meetingEndTime = $stateParams.param.meetingEndTime;
            httpService.getMeetingRoomByBuildingId({buildingId: vm.buildingId}, function(rooms){
                vm.meetingRooms = rooms
                initTimePicker()
            }, function(err){
                vm.meetingRooms = [];
            })
            httpService.companyByBuildingId({buildingId: vm.buildingId}, function(companies){
                vm.companies = companies
            }, function(err){
                console.log(err)
            })
        };

        vm.fecthMeeting()

        function initTimePicker(){
            var minTime = new Date();
            minTime.setSeconds(0);
            minTime.setMilliseconds(0);
            var mins = parseInt(minTime.getMinutes()/15)*15;
            minTime.setMinutes(mins);
            var maxTime = moment(minTime).add(1, "months").toDate();
            var emaxTime = moment(vm.bookingFormData.meetingDateTime).add(4, "hours").toDate();
            var dayEnd = moment(vm.bookingFormData.meetingDateTime).startOf("days").add(1, "days").subtract(15, 'minutes').toDate();
            emaxTime = emaxTime > dayEnd ? dayEnd : emaxTime;
            $('#startInput').val(moment(vm.bookingFormData.meetingDateTime).format("MM月DD日 HH:mm"));
            $scope.startPicker = mobiscroll.datetime('#startInput', {
                theme: 'mobiscroll',
                display: 'bottom',
                lang: 'zh',
                closeOnOverlayTap: true,
                dateFormat: "MMdd日",
                showLabel: true,
                timeFormat: "HH:ii",
                defaultValue: vm.bookingFormData.meetingDateTime,
                minDate: minTime,
                maxDate: maxTime,
                animate: false,
                focusTrap: false,
                steps: {
                    minute: 15
                },
                onClose: function(event, inst){
                    vm.bookingFormData.meetingDateTime = new Date($scope.startPicker.getVal());
                    var newMin = moment(vm.bookingFormData.meetingDateTime).add(15, "minutes").toDate();
                    var newMax = moment(vm.bookingFormData.meetingDateTime).add(4, "hours").toDate();
                    var dayEnd = moment(vm.bookingFormData.meetingDateTime).startOf("days").add(1, "days").subtract(15, 'minutes').toDate();
                    newMax = newMax > dayEnd ? dayEnd : newMax;
                    var tl = initEndList(vm.bookingFormData.meetingDateTime, vm.maxBookingHours);
                    vm.endPicker.option({
                        wheels: [
                            [{
                                circular: false,
                                data: tl,
                                label: '结束时间'
                            }]
                        ],
                    });
                    if(vm.bookingFormData.meetingEndTime > newMax || vm.bookingFormData.meetingEndTime  < newMin){
                        var newEndDate = moment(vm.bookingFormData.meetingDateTime).add(1, "hours").subtract(15, 'minutes').toDate();
                        newEndDate = newEndDate > dayEnd ? dayEnd :newEndDate;
                        $('#endInput').val(moment(newEndDate).format("MM月DD日 HH:mm"));
                        $scope.endPicker.setVal(newEndDate);
                    }
                }
            });
            $scope.startPicker.setVal(vm.bookingFormData.meetingDateTime);

            $('#endInput').val(moment(vm.bookingFormData.meetingEndTime).format("MM月DD日 HH:mm"));
            var tl = initEndList(vm.bookingFormData.meetingDateTime, vm.maxBookingHours);
            $scope.endPicker = mobiscroll.scroller('#endInput', {
                theme: 'mobiscroll',
                display: 'bottom',
                wheels: [
                    [{
                        circular: false,
                        data: tl,
                        label: '结束时间'
                    }]
                ],
                showLabel: true,
                lang: 'zh',
                onClose: function(event, inst){
                    var result = $scope.endPicker.getVal();
                    var s = result.split(":");
                    var hour = parseInt(s[0]);
                    var min = parseInt(s[1]);
                    vm.bookingFormData.meetingEndTime = moment(vm.bookingFormData.meetingDateTime).startOf('day').add(hour, "hours").add(min, "minutes");
                    $('#endInput').val(moment(vm.bookingFormData.meetingEndTime).format("MM月DD日 HH:mm"));
                }
            });
            $scope.endPicker.setVal(moment(vm.bookingFormData.meetingEndTime).format("HH:mm"))

        }

        function initEndList(date, maxLength){
            var tList = [];
            for(var i=moment(date).add(15, "minutes").toDate(); i<moment(date).startOf('day').add(1, "days").toDate(); i=moment(i).add(15, "minutes").toDate()){
                if(maxLength && maxLength > 0){
                    tList.push(moment(i).format("HH:mm") + ((maxLength && moment(date).add(maxLength, "hours").toDate() < i) ? "(需要审核)"  : "" ))
                }else{
                    tList.push(moment(i).format("HH:mm"))
                }
            }
            return tList
        }


        $scope.showMe = function(){
            $('#noMeetingTips').fadeIn(200)
        };

        $scope.hideMe = function(){
            $('#noMeetingTips').fadeOut(200);

            if ($stateParams.param) {
                var param = {
                    "selectedDate": moment(vm.bookingFormData.meetingDateTime).startOf('day').toDate(),
                    "selectedMeetingRoom": vm.bookingFormData.meetingRoom
                };
                console.log('fuck oyou');
                $state.go("operator.meeting.grid", {"param" : param, "offsetx": $stateParams.offsetx, "offsety": $stateParams.offsety, buildingId: vm.buildingId});
            } else {
                wx.closeWindow();
            }
        };

        vm.bookingConfirmOrCancelClicked = function () {
            //包含了预约与取消预约的功能
            if ($stateParams.id) {
                return vm.showDialog();
            } else {
                return vm.confirmBookingClicked();
            }
        };

        vm.confirmBookingClicked = function() {
            if(!vm.bookingFormData.meetingRoom){
                toastr.error("请选择会议室");
                return;
            }

            if(!vm.bookingFormData.company){
                toastr.error("请选择公司");
                return;
            }

            if(!vm.bookingFormData.userName){
                toastr.error("请输入预约人");
                return;
            }
            $('#loadingToast').fadeIn(100);
            var meetingTime = moment(vm.bookingFormData.meetingDate);
            var meetingStartDate = moment(vm.bookingFormData.meetingDate).hour(meetingTime.hour()).minute(meetingTime.minute()).second(0).millisecond(0).toDate();
            var meetingEndDate = moment(new Date($scope.startPicker.getVal())).hour(moment(vm.bookingFormData.meetingEndTime).hour()).minute(moment(vm.bookingFormData.meetingEndTime).minute()).second(0).millisecond(0).toDate();
            var newMeeting = {
                companyId: vm.bookingFormData.company,
                companyName: vm.bookingFormData.company.name,
                userName: vm.bookingFormData.userName,
                start: moment(new Date($scope.startPicker.getVal())).format('YYYY-MM-DD HH:mm:ss'),
                end: moment(meetingEndDate).format('YYYY-MM-DD HH:mm:ss'),
                topic: vm.bookingFormData.topic,
                remark: vm.bookingFormData.remark,
                meetingRoomId: vm.bookingFormData.meetingRoom,
                meetingRoomName: vm.bookingFormData.meetingRoom.name,
                channel: "wechat",
                phone:  vm.bookingFormData.phone
            }
            var sCompany = vm.companies.filter(function(item){
                return item.id == vm.bookingFormData.company
            })
            if(sCompany && sCompany.length > 0){
                newMeeting.companyName = sCompany[0].name
            }

            var sRoom = vm.meetingRooms.filter(function(item){
                return item.id == vm.bookingFormData.meetingRoom
            })
            if(sRoom && sRoom.length > 0){
                newMeeting.meetingRoomName = sRoom[0].name
            }

            httpService.upsertMeeting(newMeeting, function(meeting){
                var param = {
                    "selectedDate":  moment(vm.bookingFormData.meetingDateTime).startOf('day').toDate(),
                    "selectedMeetingRoom": vm.bookingFormData.meetingRoom
                };
                $('#loadingToast').fadeOut(100);
                $state.go("wechatMeeting.grid", {param : param, time: vm.bookingFormData.meetingDateTime.getHours(), "offsetx": $stateParams.offsetx, buildingId: vm.buildingId});

            }, function(err){
                console.log(err)
                $('#loadingToast').fadeOut(100);
                toastr.error('保存会议失败')
            })
        };

        vm.hideModal = function () {
            $('#iosDialog1').hide()
        };

        vm.meetingPay = function () {
            vm.wechatPay(vm.newMeeting, vm.pay);
            $('#iosDialog1').hide()
        };

        vm.wechatPay = function (newMeeting, wechatReq) {
            WeixinJSBridge.invoke('getBrandWCPayRequest', wechatReq, function(res){
                if (!res) {
                    toastr.error("微信支付失败");
                }
                if(res.err_msg == "get_brand_wcpay_request:ok"){
                    toastr.success("支付成功");
                    PurchaseRecord.confirm({recordId: wechatReq.purchaseId}, function (record) {
                        newMeeting.purchaseRecordId = wechatReq.purchaseId;
                        console.log("purchase record::: ", wechatReq);
                        Meeting.create(newMeeting, function(meeting){
                            var param = {
                                "selectedDate":  moment(vm.bookingFormData.meetingDateTime).startOf('day').toDate(),
                                "selectedMeetingRoom": vm.bookingFormData.meetingRoom
                            };
                            $state.go("operator.meeting.grid", { param : param, time: vm.bookingFormData.meetingDateTime.getHours(), "offsetx": $stateParams.offsetx, buildingId: vm.buildingId});
                        }, function (err) {
                            toastr.error("预定会议室失败了");
                        });
                    }, function (err) {
                        console.log("purchase err: ", err);
                    });
                } else {
                    toastr.error("支付失败");
                }
            });

        };

        $scope.setConfirm = function (){
            vm.needConfirm = false;
            for (var i = 0; i < vm.meetingRooms.length; i++)
                if (vm.meetingRooms[i].id == vm.bookingFormData.meetingRoom) {
                    vm.maxBookingHours = undefined;
                    if(vm.meetingRooms[i].properties && vm.meetingRooms[i].properties.maxBookingHours > 0){
                        vm.needConfirm = true;
                        vm.maxBookingHours = vm.meetingRooms[i].properties.maxBookingHours;
                        vm.info = "超过"+vm.meetingRooms[i].properties.maxBookingHours+"小时的预约需要审核"
                    }
                    if(vm.meetingRooms[i].properties && vm.meetingRooms[i].properties.needConfirm == true){
                        vm.needConfirm = true;
                        vm.info = "该会议室的预定需要管理员审核"
                    }
                }
        };

        vm.cancelClicked = function() {
            var param = {
                "selectedDate": moment(vm.bookingFormData.meetingDateTime).startOf('day').toDate(),
                "selectedMeetingRoom": vm.bookingFormData.meetingRoom
            };
            $state.go("operator.meeting.grid", {param : param, offsetx: $stateParams.offsetx, offsety: $stateParams.offsety, buildingId: vm.buildingId});
        };

        vm.modifyOrCancelClicked = function () {
            if ($stateParams.param) {
                vm.cancelClicked();
            } else {
                wx.closeWindow();
            }
        };

        function isUndefinedOrNull(obj) {
            return typeof(obj) === "undefined" || obj === null;
        }


        $(function(){
            $('#dialogs').on('click', '.weui-dialog__btn', function(){
                $(this).parents('.js_dialog').fadeOut(200);
            });
        });

    }
})();
