(function() {
  angular
    .module('app')
    .controller('ActivityInfoCtrl', ActivityInfoCtrl);

  ActivityInfoCtrl.$inject = ['$scope', '$element', '$stateParams', 'Activity', 'ActivityApply', 'User', '$timeout'];

  function ActivityInfoCtrl($scope, $element, $stateParams, Activity, ActivityApply, User, $timeout) {
    if($stateParams.id){

      Activity.findById({id: $stateParams.id}, function(activity){
        $scope.activity = activity;
        //var content = activity.content.replace(/width: .*?px/g,'width: 100%');
        $('#activityContent').html(activity.content);
        //var paragraphs=document.getElementsByTagName("p");
        //for(i=0; i< paragraphs.length; i++){
        //paragraphs[i].style.textAlign = "justify";
        //paragraphs[i].style.letterSpacing = '-.05em';
        //}
        $('#activityContent').css({textAlign:'justify', letterSpacing: '0'});
        //$('#policyContent p').innerHTML.split("").join(" ");

      }, function(err){
        console.info(err)
      })
    }


    $scope.hideModal = function(){
      $('#iosDialog1').hide()
    };

    $scope.showModal = function(){
      $scope.name = undefined;
      $('#phoneInput').val("");
      $('#emailInput').val("");
      $('#iosDialog1').show()
    };

    $scope.apply = function(){
      if(User.getCurrentId()){
        User.findById({id: User.getCurrentId()}, function (user) {
          ActivityApply.create({name: user.name, phone: user.phone, email: user.email, activityId: $scope.activity.id, userId: user.id}, function(result){
            //toastr.success("申请成功")
            $('#toast').fadeIn(100);
            $timeout(function(){
              $('#toast').fadeOut(100);
            }, 1000)
          }, function(err){
            toastr.error("申请失败")
          })
        }, function(err){
          $scope.showModal();
          console.info(err)
        })
      }else{
        $scope.showModal()
      }
    };

    $scope.guestApply = function(){
      if(!$scope.name){
        toastr.error("请输入姓名");
        return
      }

      if(!$('#phoneInput').hasClass('ng-valid')){
        if($('#phoneInput').hasClass('ng-invalid-required')) {
          toastr.error("请输入手机号");
        }else{
          toastr.error("手机号格式错误");
        }
        $('#phoneInput').addClass('ng-dirty');
        $('#phoneInput').addClass('ng-invalid');
        return
      }

      if(!$('#emailInput').hasClass('ng-valid')){
        if($('#emailInput').hasClass('ng-invalid-required')) {
          toastr.error("请输入邮箱");
        }else{
          toastr.error("邮箱格式错误");
        }
        $('#emailInput').addClass('ng-dirty');
        $('#emailInput').addClass('ng-invalid');
        return
      }
      ActivityApply.create({name: $scope.name, phone: $scope.phone, email: $scope.email, activityId: $scope.activity.id}, function(result){
        $('#toast').fadeIn(100);
        $timeout(function(){
          $('#toast').fadeOut(100);
        }, 1000);
        $scope.hideModal()
      }, function(err){
        toastr.error("申请失败")
      })

    }
  }
})();
