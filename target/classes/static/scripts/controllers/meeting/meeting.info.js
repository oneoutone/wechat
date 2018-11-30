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
    .controller('BookingFormCtrl', BookingFormCtrl);
  BookingFormCtrl.$inject = ['$scope', '$location', '$filter', 'Unit', 'Team', 'Meeting', '$element', '$state', '$stateParams', '$window', 'User', 'toastr', 'PurchaseRecord', '$timeout'];


  function BookingFormCtrl($scope, $location, $filter, Unit, Team, Meeting, $element, $state, $stateParams, $window, User, toastr, PurchaseRecord, $timeout) {


    $scope.$on("uiBack", function (event, args) {
      $('.mbsc-ios').hide();
      $element.addClass("back");
    });
    console.log("get bookingId: ", $stateParams.id);

    var vm = $scope;
    vm.nextFlag = false

    vm.bookingFormData ={}

    vm.initMeetingInfo = function(callback) {
      User.findById({id: User.getCurrentId(), filter: {include: ['team']}}, function (user, res) {
        vm.user = user;
        if (user.team) {
          vm.team = user.team;
          Team.prototype$coins({id: user.team.id}, function(result){
            vm.currentCoins = result.value
          },function(err){
            vm.currentCoins = 0
          })
        }
        callback()
      });
    };

    vm.fecthMeeting =function(){
      if($stateParams.id){
        vm.meetingId = $stateParams.id;
        Meeting.findById({id: vm.meetingId, filter:{include:['room']}}, function (meeting) {
          vm.bookingFormData.meetingRoom = meeting.roomId;
          vm.bookingFormData.meetingDateTime = new Date(meeting.start);
          vm.bookingFormData.meetingEndTime = new Date(meeting.end);
          vm.bookingFormData.subject = meeting.topic;
          vm.bookingFormData.description = meeting.notes;
          vm.meeting = meeting;
          vm.showTerminate = false
          vm.showDetele = false
          var now = new Date()
          if(now >= vm.bookingFormData.meetingDateTime && now <moment(vm.bookingFormData.meetingEndTime).subtract(15, 'minutes').toDate() ){
            vm.showTerminate = true
          }
          if(now < vm.bookingFormData.meetingDateTime){
            vm.showDetele = true
          }
          $('#startInput').val(moment(vm.bookingFormData.meetingDateTime).format("MM月DD日 HH:mm"));
          $('#endInput').val(moment(vm.bookingFormData.meetingEndTime).format("MM月DD日 HH:mm"));
          Unit.find({ filter: { where: { type: 'meetingRoom', spaceId: vm.meeting.room.spaceId} } }, function(rooms) {
            vm.meetingRooms = rooms.filter(function(item){
              return (item.properties && item.properties.needBooking == true)
            });
            $scope.setConfirm();
          }, function(err) {
            console.info("get meeting rooms failed: ", err);
            vm.meetingRooms = [];
          });
          if(meeting.confirmed === false && (vm.app.roles.director || vm.app.roles.clerk || vm.app.roles.admin || vm.app.roles.executive)){
            $scope.confirmManager = true
          }
          if(moment(new Date()) > moment(meeting.end)) {
            $("#bookingBtn").hide();
          }
        }, function(err){
          $scope.showMe = function(){
            $('#noMeetingTips').fadeIn(200)
          };
          console.info(err)
        });
      }else{
        vm.bookingFormData.meetingRoom = $stateParams.param.meetingRoom;
        vm.bookingFormData.meetingDateTime = $stateParams.param.meetingTime;
        vm.bookingFormData.meetingEndTime = $stateParams.param.meetingEndTime;
        Unit.findById({id: $stateParams.param.meetingRoom}, function(room){
          Unit.find({ filter: { where: { type: 'meetingRoom', spaceId: room.spaceId} } }, function(rooms) {
            vm.meetingRooms = rooms.filter(function(item){
              return (item.properties && item.properties.needBooking == true)
            });
            $scope.setConfirm();
            initTimePicker()
          }, function(err) {
            console.info("get meeting rooms failed: ", err);
            vm.meetingRooms = [];
          });
        }, function(err){
          console.info(err)
        })
      }
    };

    vm.initMeetingInfo(vm.fecthMeeting);

    function initTimePicker(){
      var minTime = new Date();
      minTime.setSeconds(0);
      minTime.setMilliseconds(0);
      var mins = parseInt(minTime.getMinutes()/15)*15 + 15;
      if(mins < 60){
        minTime.setMinutes(mins);
      }else{
        minTime = moment(minTime).startOf('hour').add(1, 'hours').toDate()
      }
      var maxTime = moment(minTime).add(1, "months").toDate();
      var emaxTime = moment(vm.bookingFormData.meetingDateTime).add(4, "hours").toDate();
      var dayEnd = moment(vm.bookingFormData.meetingDateTime).startOf("days").add(1, "days").subtract(15, 'minutes').toDate();
      emaxTime = emaxTime > dayEnd ? dayEnd : emaxTime;
      var currentMonth = (new Date()).getMonth()
      var meetingMonth = vm.bookingFormData.meetingDateTime.getMonth()
      if(currentMonth < meetingMonth){
        vm.nextFlag = true
      }
      vm.app.date = moment(vm.bookingFormData.meetingDateTime).startOf('day').toDate()
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
        min: minTime,
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
          var currentMonth = (new Date()).getMonth()
          var meetingMonth = vm.bookingFormData.meetingDateTime.getMonth()
          if(currentMonth < meetingMonth){
            vm.nextFlag = true
          }
          $scope.$apply(function () {
            vm.resetCost()
          });
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
            var newEndDate = moment(vm.bookingFormData.meetingDateTime).add(1, "hours").toDate();
            vm.bookingFormData.meetingEndTime = newEndDate
            newEndDate = newEndDate > dayEnd ? dayEnd :newEndDate;
            $('#endInput').val(moment(newEndDate).format("MM月DD日 HH:mm"));
            $scope.endPicker.setVal(newEndDate);
            $scope.$apply(function () {
              vm.resetCost()
            });
          }
          vm.app.date = moment(vm.bookingFormData.meetingDateTime).startOf('day').toDate()
          $('#startInput').val(moment(vm.bookingFormData.meetingDateTime).format("MM月DD日 HH:mm"));
        }
      });
      $scope.startPicker.setVal(moment(vm.bookingFormData.meetingDateTime).format("HH:mm"));

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
          $scope.$apply(function () {
            vm.resetCost()
          });
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
        $state.go("operator.meeting.grid", {"param" : param, "offsetx": $stateParams.offsetx, "offsety": $stateParams.offsety});
      } else {
        wx.closeWindow();
      }
    };

    vm.bookingConfirmOrCancelClicked = function () {
      //包含了预约与取消预约的功能
      //console.info(vm.user);
      if(!vm.user || !vm.user.team){
        toastr.error("对不起， 您不属于任何团队，不能操作会议");
        return;
      }
      if ($stateParams.id) {
        return vm.showDialog();
      } else {
        return vm.confirmBookingClicked();
      }
    };

    vm.confirmBookingClicked = function() {
      if (isUndefinedOrNull(vm.bookingFormData.meetingRoom)) {
        toastr.error("请选择会议室");
        return;
      }
      if (isUndefinedOrNull(vm.bookingFormData.meetingDateTime)) {
        toastr.error("请选择会议日期和开始时间");
        return;
      }
      if (isUndefinedOrNull(vm.bookingFormData.meetingEndTime)) {
        toastr.error("请选择会议持续时间");
        return;
      }

      var now = new Date()
      var min = now.getMinutes()
      if(min < 15){
        now.setMinutes(0)
      }else if(min < 30){
        now.setMinutes(15)
      }else if(min < 45){
        now.setMinutes(30)
      }else{
        now.setMinutes(45)
      }
      now.setSeconds(0)
      now.setUTCMilliseconds(0)
      if (now > new Date(vm.bookingFormData.meetingDateTime)){
        toastr.error("不能预订过去时间的会议");
        return;
      }

      var newMeeting = {
        start: new Date(vm.bookingFormData.meetingDateTime),
        end: new Date(vm.bookingFormData.meetingEndTime),
        topic: vm.bookingFormData.subject,
        notes: vm.bookingFormData.description,
        roomId: vm.bookingFormData.meetingRoom,
        teamId: vm.user.teamId,
        organizerId: vm.user.id,
        price:  vm.coins ? vm.coins : 0
      };
      $('#loadingToast').fadeIn(100);
      Meeting.create(newMeeting, function(meeting){
        var param = {
          "selectedDate":  moment(vm.bookingFormData.meetingDateTime).startOf('day').toDate(),
          "selectedMeetingRoom": vm.bookingFormData.meetingRoom
        };
        $('#loadingToast').fadeOut(100);
        $state.go("operator.meeting.grid", {param : param, time: vm.bookingFormData.meetingDateTime.getHours(), "offsetx": $stateParams.offsetx});
      }, function(err){
        if(err.status == 409){
          $('#loadingToast').fadeOut(100);
          toastr.error("与已预定的会议时间冲突")
        }else if (err.status == 403) {
          console.log("error::: ", err);
          var data = JSON.parse(err.data.error.message);
          console.log("data::: ", data);
          if (!data.purchaseId) {
            toastr.error("服务器拒绝执行");
          } else {
            vm.pay = data;
            vm.newMeeting = newMeeting;
            $('#iosDialog1').show();
            //vm.wechatPay(newMeeting, data);
          }
        } else {
          toastr.error("预定会议失败")
        }
        $('#loadingToast').fadeOut(100);
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
              $state.go("operator.meeting.grid", { param : param, time: vm.bookingFormData.meetingDateTime.getHours(), "offsetx": $stateParams.offsetx});
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
        vm.resetCost()
    }

    vm.cancelClicked = function() {
      var param = {
        "selectedDate": moment(vm.bookingFormData.meetingDateTime).startOf('day').toDate(),
        "selectedMeetingRoom": vm.bookingFormData.meetingRoom
      }
      $state.go("operator.meeting.grid", {param : param, offsetx: $stateParams.offsetx, offsety: $stateParams.offsety});
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

    vm.resetEndTime= function(){

    };

    vm.terminate = function(){
      var tDate = new Date()
      var min = tDate.getMinutes()
      if(min < 15){
        tDate.setMinutes(15)
        tDate.setSeconds(0)
        tDate.setUTCMilliseconds(0)
      }else if(min < 30){
        tDate.setMinutes(30)
        tDate.setSeconds(0)
        tDate.setUTCMilliseconds(0)
      }else if(min < 45){
        tDate.setMinutes(45)
        tDate.setSeconds(0)
        tDate.setUTCMilliseconds(0)
      }else{
        tDate.setMinutes(0)
        tDate.setSeconds(0)
        tDate.setUTCMilliseconds(0)
        tDate = moment(tDate).add(1, 'hours').toDate()
      }
      vm.terminateDate = tDate
      vm.terminateTime = moment(tDate).format("HH:mm")
      if(tDate > vm.bookingFormData.meetingEndTime){
        $('#NoTermianteMeeting').fadeIn(200);
      }else{
        $('#TermianteMeeting').fadeIn(200);
      }
    }

    vm.showDialog = function () {
      var $deleteMeeting = $('#DeleteMeeting');
      $deleteMeeting.fadeIn(200);
    };


    vm.onTerminate = function(value){
      if(value){
        Meeting.prototype$updateAttributes({id: vm.meetingId}, {end: vm.terminateDate}, function(result){
          toastr.success("提前结束成功");
          if ($stateParams.param) {
            var param = {
              "selectedDate": moment(vm.bookingFormData.meetingDateTime).startOf('day').toDate(),
              "selectedMeetingRoom": vm.bookingFormData.meetingRoom
            };
            $state.go("operator.meeting.grid", {param : param, time: vm.bookingFormData.meetingDateTime.getHours(), "offsetx": $stateParams.offsetx});
          } else {
            wx.closeWindow();
          }
        }, function(err){
          toastr.error("提前结束失败");
          console.info(err)
        })
      }else{
        $('#TermianteMeeting').fadeOut(200);
      }
    }

    vm.closeNoTerminate = function(){
      $('#NoTermianteMeeting').fadeOut(200);
    }

    vm.onDelete = function (value) {

      if (!value)
        return;
      Meeting.deleteById({id: $stateParams.id}, function (meeting, res) {
        if ($stateParams.param) {
          vm.cancelClicked();
        } else {
          wx.closeWindow();
        }

      }, function (err) {
        //history.go(-1);
        toastr.error('删除失败');
      });
    };

    $scope.confirm = function(){
      Meeting.prototype$confirm({id: vm.meetingId},function(result){
        toastr.success("审核成功");
        var param = {
          "selectedDate": moment(vm.bookingFormData.meetingDateTime).startOf('day').toDate(),
          "selectedMeetingRoom": vm.bookingFormData.meetingRoom
        };
        $state.go("operator.meeting.grid", {param : param, time: vm.bookingFormData.meetingDateTime.getHours(), "offsetx": $stateParams.offsetx});
      },function(err){
        toastr.error("审核失败"+ err);
        console.info(err)
      })
    }

    vm.resetCost = function(){
      console.log('resetCost')
      var meetingTime = moment(vm.bookingFormData.meetingDateTime);
      var meetingEndTime = moment(vm.bookingFormData.meetingEndTime);
      var r = vm.meetingRooms.filter(function(item){
        return item.id === vm.bookingFormData.meetingRoom
      })
      calCoins(meetingTime, meetingEndTime, r[0])
    }

    function calCoins(start, end, unit){
      console.log('calCoins')
      start = new Date(new Date(start).setMilliseconds(0))
      end = new Date(new Date(end).setMilliseconds(0))
      var d = start.getDay()
      if(d == 0 || d==6){
        vm.coins = 0
        return
      }
      var day = (new Date(start)).getDay()
      var start = new Date(start)
      var end = new Date(end)
      var dayStart =  (new Date(start)).setHours(9)
      dayStart = new Date(dayStart).setMinutes(0)
      dayStart = new Date(dayStart).setMilliseconds(0)
      dayStart = new Date(dayStart)
      var dayEnd =  (new Date(end)).setHours(19)
      dayEnd = new Date(dayEnd).setMinutes(0)
      dayEnd = new Date(dayEnd).setMilliseconds(0)
      dayEnd = new Date(dayEnd)
      if(start < dayStart){
        start = dayStart
      }
      if(end > dayEnd){
        end = dayEnd
      }
      var duration = moment(end).diff(moment(start), 'minutes') / 60;
      console.log(duration)
      var price = 0
      vm.coins = 0
      if(unit.properties && unit.properties.price){
        price = unit.properties.price
      }
      console.log(price)
      console.log('price')
      var amount = Decimal(price).mul(duration).toNumber()
      amount = Math.round(amount*100)/100
      vm.coins = amount > 0 ? amount : 0
    }
    }
})();
