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
    .controller('VPNCtrl', VPNCtrl);

  VPNCtrl.$inject = ['$scope',  '$location', 'User', 'Util', 'SeUtil', '$window'];
  function VPNCtrl($scope, $location, User, Util, SeUtil) {

    var vm = $scope;
    var code = $location.search().code;

    //if (!code && SeUtil.isWechatBrowser()) {
    //  // wechat authentication
    //  Util.getWechatId(function (value){
    //    var port = ($location.port() == 443 || $location.port() == 80) ? "" : ":" + $location.port();
    //    var url = $location.protocol() + "://" + $location.host() + port + "/m/"+ $state.current.name;
    //    var href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ value.wechatId + '&redirect_uri=' +
    //      encodeURI(url) + '&response_type=code&scope=snsapi_userinfo&state='+ state + '#wechat_redirect';
    //    $window.location.href = href;
    //  }, function (err){
    //    console.error(err);
    //  });
    //}

    if (code && SeUtil.isWechatBrowser()) {
      User.wechatAuth({code: code}, function (res) {
        console.info(res);
        if (res.provider) {
          vm.userIdentity = res;
        } else {
          LoopBackAuth.setUser(res.id, res.userId);
          LoopBackAuth.rememberMe = true;
          LoopBackAuth.save();
          var state = $location.search().state;
          var uri = decodeURIComponent(state);
          $('#loadingToast').fadeOut(100);
          $location.path(uri).replace();
        }
      }, function (errRes) {
        console.error(errRes)
      });
    }
  }
})();
