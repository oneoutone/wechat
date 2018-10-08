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
    .controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['$scope', 'User', '$state', 'toastr', '$location', '$stateParams', '$element', '$http', '$window', 'SeUtil'];

  function ProfileCtrl ($scope, User, $state, toastr, $location, $stateParams, $element, $http, $window, SeUtil) {

    $scope.$on("uiBack", function (event, args) {
      $element.addClass("back");
    });

    $scope.user = {};

    var vm=$scope

    var pramasLit = window.location.search.substring(1).split(/&/)

    var pramas = {}
    for (var i = 0; i < pramasLit.length; i++){
        var r = pramasLit[i].split(/=/)
        if(r.length == 2){
            pramas[r[0]] = r[1]
        }
    }
    var code = pramas.code

    if((!vm.app.setting.accessToken ||  (vm.app.setting.expire && moment(vm.app.setting.expire).toDate() < new Date())) && !code && SeUtil.isWechatBrowser()){
      $window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe046330b69c05b15&redirect_uri=http://alextest.nat300.top/%23/profile&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
      return
    }
    if(code){
      $http.post(vm.app.host+'/users/wechatAuth', {code: code})
              .success(function (data, header, config, status) {
                  console.info(data);
                  vm.app.setting.accessToken = data.accessToken
                  vm.app.setting.userId = data.userId
                  vm.app.setting.udeskId = data.udeskId
                  vm.app.setting.expire = data.expire
                  console.log("expire")
                  console.log(data.expire)
                  $http({
                      method:'get',
                      url:vm.app.host +  '/users/profile',
                      headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken}
                  }).success(function(data, header, config, status){
                      console.log(data);
                      vm.user = data
                  })
              })
              .error(function (data, header, config, status) {
                  console.info(data);
              })
      }

      if(vm.app.setting.accessToken){
          $http({
              method:'get',
              url:vm.app.host +  '/users/profile',
              headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken}
          }).success(function(data, header, config, status){
              console.log(data);
              vm.user = data
          })
      }

    /*
     User.getCurrent(function(user){
     console.info(user);
     $scope.user = user;
     }, function(err){
     console.info(err);
     });
     */

    $scope.save = function(){

        $http({
            method:'post',
            url:vm.app.host +  '/users/profile',
            headers:{'Content-Type': 'application/json', 'Authorization': vm.app.setting.accessToken},
            data: {email: vm.user.email}
        }).success(function(data, header, config, status){
        })

      // if(!$('#emailInput').hasClass('ng-valid')){
      //   if($('#emailInput').hasClass('ng-invalid-required')) {
      //     toastr.error("邮箱不能为空");
      //   }else{
      //     toastr.error("邮箱格式错误");
      //   }
      //   $('#emailInput').addClass('ng-dirty');
      //   $('#emailInput').addClass('ng-invalid');
      //   return
      // }
      //
      // if(!$('#phoneInput').hasClass('ng-valid')){
      //   if($('#phoneInput').hasClass('ng-invalid-required')) {
      //     toastr.error("手机号不能为空");
      //   }else{
      //     toastr.error("手机号格式错误,请输入11位数字手机号码");
      //   }
      //   $('#phoneInput').addClass('ng-dirty');
      //   $('#phoneInput').addClass('ng-invalid');
      //   return
      // }


      // $('#loadingToast').fadeIn(200);
      // User.prototype$updateAttributes({id: $scope.user.id}, $scope.user, function(user){
      //   $('#loadingToast').fadeOut(200);
      //   User.findById({id: user.id, filter:{include: 'accessCards'}}, function (user) {
      //     $scope.user = user;
      //     for (var i = 0; i < user.accessCards.length; i++) {
      //       var accessCard = user.accessCards[i];
      //       if (!accessCard.destroyedDate) {
      //         $scope.user.card = accessCard;
      //         break;
      //       }
      //     }
      //     toastr.success("更新成功");
      //   });
      // }, function(err){
      //   $('#loadingToast').fadeOut(200);
      //   if(err.status == 423){
      //     toastr.error("邮箱已被绑定");
      //   }else if(err.status == 424){
      //     toastr.error("手机号已被绑定");
      //   }else{
      //     toastr.error("更新失败");
      //   }
      //   console.info(err);
      // })


    }
  }
})();
