/**
 * Created by harris on 2016/12/18.
 */
(function() {
  angular
    .module('app')
    .config(function(toastrConfig) {
      angular.extend(toastrConfig, {
        positionClass: 'toast-top-full-width',
        preventOpenDuplicates: true,
        timeOut: 4000
      });
    })
    .controller('ServiceCtrl', ServiceCtrl);
  ServiceCtrl.$inject = ['$scope','toastr', 'User', 'ServiceApply'];
  function ServiceCtrl($scope, toastr, User, ServiceApply) {
    $scope.apply = function () {
      if(User.getCurrentId()){
        User.findById({id: User.getCurrentId()}, function (user) {
          //ServiceApply.apply({type: 'service', userId: user.id}, function (pay, res) {
          ServiceApply.serviceApply({name: user.name, phone: user.phone, email: user.email}, function (pay, res) {
            toastr.success("技术服务邮件发送了");
          }, function (err) {
            toastr.error("技术服务邮件发送失败了");
          });
        }, function(err){
          $scope.showModal();
          console.info(err)
        })
      } else {
        $scope.showModal();
      }
    };

    $scope.showModal = function(){
      $scope.name = undefined;
      $('#phoneInput').val("");
      $('#emailInput').val("");
      $('#iosDialog1').show()
    };

    $scope.hideModal = function(){
      $('#iosDialog1').hide()
    };

    $scope.guestApply = function () {
      if (!$scope.name) {
        toastr.error("请填写姓名");
        return;
      }
      if (!$scope.phone) {
        toastr.error("请填写手机号");
        return;
      }
      if (!$scope.email) {
        toastr.error("请填写邮箱");
        return;
      }
      ServiceApply.serviceApply({name: $scope.name, phone: $scope.phone, email: $scope.email}, function (pay, res) {
        toastr.success("技术服务邮件发送了");
        $('#iosDialog1').hide();
      }, function (err) {
        toastr.error("创建用户失败");
        $('#iosDialog1').hide();
      });
    }
  }

})();
