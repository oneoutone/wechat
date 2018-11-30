/**
 * Created by harris on 16/9/26.
 */
(function() {
  angular
    .module('app')
    .controller('OpenDoorCtrl', OpenDoorCtrl);

  OpenDoorCtrl.$inject = ['$scope', '$stateParams', 'AccessControl', 'User', '$state'];

  function OpenDoorCtrl ($scope, $stateParams, AccessControl, User, $state) {
    var vm = $scope;

    if(!User.isAuthenticated()){
      $state.go('operator.userGuide', {operatorId: $stateParams.operatorId});
      return
    }
    console.info($stateParams.unitId);
    if(!$stateParams.unitId){
        return
    }
    $('#loadingToast').fadeIn(100);
      AccessControl.wechatOpen({ unitId: $stateParams.unitId}, function(result){
        console.info(result);
        $('#loadingToast').fadeOut(100);
        vm.result = "成功";
        vm.status = 'ok'
      }, function(err){
        console.info(err);
        $('#loadingToast').fadeOut(100);
        vm.status = 'fail';
        if(err.status == 403){
          vm.code = 403;
          vm.result = err.data.error.message ? err.data.error.message : "错误";
        }else if(err.status == 500){
          vm.code = 500;
          vm.result = "开门失败，请重试!";
        }else{
          vm.result = err.data.error.message ? err.data.error.message : "未知错误";
        }
      });

    $scope.quit = function(){
      wx.closeWindow();
    };

    $scope.clickAction = function(){
      if(vm.code == 403){
        $state.go('operator.meeting.grid');
        return
      }
      $('#loadingToast').fadeIn(100);
      vm.status = undefined;
      AccessControl.wechatOpen({ unitId: $stateParams.unitId}, function(result){
        $('#loadingToast').fadeOut(100);
        vm.result = "成功";
        vm.status = 'ok'
      }, function(err){
        console.info(err);
          $('#loadingToast').fadeOut(100);
          vm.status = 'fail';
          if(err.status == 403){
            vm.code = 403;
            vm.result = err.data.error.message ? err.data.error.message : "错误";
          }else if(err.status == 500){
            vm.code = 500;
            vm.result = "开门失败，请重试!";
          }else{
            vm.result = err.data.error.message ? err.data.error.message : "未知错误";
          }

      });
    }
  }
})();
