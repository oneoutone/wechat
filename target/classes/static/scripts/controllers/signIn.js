/**
 * Created by harris on 16/9/26.
 */
(function() {
  angular
    .module('app')
    .config(function(toastrConfig) {
      angular.extend(toastrConfig, {
        positionClass: 'toast-top-full-width',
        preventOpenDuplicates: true,
        timeOut: 1000
      });
    })
    .controller('SignInCtrl', SignInCtrl);

  SignInCtrl.$inject = ['$scope', 'User', 'LoopBackAuth', '$state', '$location', '$window', 'Util', 'SeUtil', 'toastr', '$stateParams'];

  function SignInCtrl ($scope, User, LoopBackAuth, $state, $location, $window, Util, SeUtil, toastr, $stateParams) {
    var code = $location.search().code;
    var state = $location.search().state;
    var vm = $scope;
    console.log('sign in from state:' + state);

    if (!code && SeUtil.isWechatBrowser()) {
      // wechat authentication
      Util.getWechatAccount({operatorId: $stateParams.operatorId}, function (wechatAccount) {
        var port = ($location.port() === 443 || $location.port() === 80) ? "" : ":" + $location.port();
        var url = $location.protocol() + "://" + $location.host() + port + "/m/o/"+ $stateParams.operatorId + '/signIn';
        $window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wechatAccount.appId + '&redirect_uri=' +
          encodeURI(url) + '&response_type=code&scope=snsapi_userinfo&state=' + state + '#wechat_redirect';
      }, function (err) {
        console.error(err);
      });
    }

    if (code && SeUtil.isWechatBrowser()) {
      User.wechatAuth({operatorId: $stateParams.operatorId, code: code}, function (res) {
        if (res.provider) {
          vm.userIdentity = res;
        } else {
          LoopBackAuth.setUser(res.id, res.userId);
          LoopBackAuth.rememberMe = true;
          LoopBackAuth.save();
          vm.app.init();
          var state = $location.search().state;
          var uri = decodeURIComponent(state);
          // $location.search({});
          $location.path(uri).replace();
        }
      }, function (errRes) {
        console.error(errRes)
      });
    }

    $scope.showMe = function(){
      $('#LoginTips').fadeIn(200)
    };

    $scope.hideMe = function(){
      $('#LoginTips').fadeOut(200)
    };

    $scope.login = function (username, password) {
      if(!username){
        toastr.error('请输入用户名');
        return;
      }
      if(!password){
        toastr.error('请输入密码');
        return;
      }
      //$scope.loading = true;
      if ($('#loadingToast').css('display') != 'none'){
        return
      }
      $('#loadingToast').fadeIn(100);
      //User.login({username: username, password: password, code: code}, function (accessToken) {

      var credentials = {
        username: username,
        password: password
      };
      if (vm.userIdentity) {credentials.userIdentityId = vm.userIdentity.id;}

      User.login(credentials, function (accessToken) {
        LoopBackAuth.setUser(accessToken.id, accessToken.userId);
        LoopBackAuth.rememberMe = true;
        LoopBackAuth.save();
        vm.app.init();
        var state = $location.search().state;
        var uri = decodeURIComponent(state);
        $('#loadingToast').fadeOut(100);
        $location.path(uri).replace();
      }, function (err) {
        $('#loadingToast').fadeOut(100);
        if(err.status === 401){
          toastr.error(err.message);
        }else{
          toastr.error('登录失败，请重新尝试');
        }
      });
    };
  }

})();
