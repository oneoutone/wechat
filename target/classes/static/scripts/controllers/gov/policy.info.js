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
    .controller('PolicyInfoCtrl', PolicyInfoCtrl);

  PolicyInfoCtrl.$inject = ['$scope', '$stateParams', 'Policy', 'toastr', 'User', '$timeout'];

  function PolicyInfoCtrl($scope, $stateParams, Policy, toastr, User, $timeout) {
    if($stateParams.id){
      console.info($stateParams.id);
      Policy.findById({id: $stateParams.id}, function(policy){
        $scope.policy = policy;
        var content = policy.content.replace(/width: .*?px/g,'width: 100%');
        $('#policyContent').html(content);
        $('#policyContent').css({textAlign:'justify', letterSpacing: '0'});
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
          Policy.prototype$apply({
            id: $scope.policy.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            userId: user.id
          }, function (result) {
            $('#toast').fadeIn(100);
            $timeout(function(){
              $('#toast').fadeOut(100);
            }, 1000);
            $scope.hideModal()
          }, function (err) {
            console.error(err);
            toastr.error("申请失败")
          });
        }, function(err){
          console.error(err);
          $scope.showModal();
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

      Policy.prototype$apply({
        id: $scope.policy.id,
        name: $scope.name,
        phone: $scope.phone,
        email: $scope.email
      }, function (result) {
        $('#toast').fadeIn(100);
        $timeout(function(){
          $('#toast').fadeOut(100);
        }, 1000);
        $scope.hideModal()
      }, function (err) {
        console.error(err);
        toastr.error("申请失败")
      });

    }
  }
})();
