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
    .controller('PasswordCtrl', PasswordCtrl);

  PasswordCtrl.$inject = ['$scope', 'User', '$state', 'toastr', '$interval', '$timeout','$stateParams', '$element'];

  function PasswordCtrl($scope, User, $state, toastr, $interval, $timeout, $stateParams, $element) {

    $scope.$on("uiBack", function (event, args) {
      $element.addClass("back");
    });

    $scope.disable = false;
    $scope.content = "获取验证码";

    $scope.generateAuthCode = function(){
      if($scope.disable){
        return;
      }
      if(!$('#phoneInput').hasClass('ng-valid')){
        if($('#phoneInput').hasClass('ng-invalid-required')) {
          toastr.error("手机号不能为空");
        }else{
          toastr.error("手机号格式错误,请输入11位数字手机号码");
        }
        $('#phoneInput').addClass('ng-dirty');
        $('#phoneInput').addClass('ng-invalid');
        return
      }
      $('#loadingToast').fadeIn(200);
      User.getVerifyCode({phone: $scope.phone, key: $scope.app.apiKey},function(result){
        toastr.success("动态验证码已发送");
        $('#loadingToast').fadeOut(200);
        $scope.disable = true;
        var timer = 60;
        $scope.content = timer + 's';
        var clock = $interval(function(){
          timer--;
          $scope.content = timer + 's';
          if(timer <= 0){
            $scope.disable = false;
            $scope.content = "获取验证码"
          }
        },1000, 60);
      }, function(err){
        toastr.error("发送动态验证码失败");
        $('#loadingToast').fadeOut(200);
      })
    };

    $scope.savePassword = function(){
      if(!$('#phoneInput').hasClass('ng-valid')){
        if($('#phoneInput').hasClass('ng-invalid-required')) {
          toastr.error("手机号不能为空");
        }else{
          toastr.error("手机号格式错误,请输入11位数字手机号码");
        }
        $('#phoneInput').addClass('ng-dirty');
        $('#phoneInput').addClass('ng-invalid');
        return
      }

      if(!$('#authCodeInput').hasClass('ng-valid')){
        toastr.error("请输入动态验证码");
        $('#phoneInput').addClass('ng-dirty');
        $('#phoneInput').addClass('ng-invalid');
        return
      }

      if(!$('#passInput').hasClass('ng-valid')){
        toastr.error("请输入密码");
        $('#passInput').addClass('ng-dirty');
        $('#passInput').addClass('ng-invalid');
        return
      }

      if(!$('#repassInput').hasClass('ng-valid')){
        toastr.error("请输入确认密码");
        $('#repassInput').addClass('ng-dirty');
        $('#repassInput').addClass('ng-invalid');
        return
      }

      if($('#passInput').val()!= $('#repassInput').val()){
        toastr.error("两次输入的密码不匹配");
        $('#passwordInput').val("");
        $('#confirmInput').val("");
        return;
      }

      $('#loadingToast').fadeIn(200);
      User.resetPasswordByCode({phone: $scope.phone, code: $scope.authCode , password: $scope.password}, function(result){
        $('#loadingToast').fadeOut(200);
        toastr.success("重置密码成功");
        // 重置密码之后跳转到menu界面。
        $timeout(function() {
          $state.go('signIn', {state: 'menu'})
        }, 100);

      }, function(err){
        $('#loadingToast').fadeOut(200);
        console.info(err);
        toastr.error(err.message);
      })
    }

  }
})();
