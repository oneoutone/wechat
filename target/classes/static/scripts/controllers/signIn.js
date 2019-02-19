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

  SignInCtrl.$inject = ['$scope', '$state', '$location', '$window','toastr', '$stateParams', 'httpService', 'SeUtil', '$interval', '$localStorage'];

  function SignInCtrl ($scope, $state, $location, $window, toastr, $stateParams, httpService, SeUtil, $interval, $localStorage) {
      var vm = $scope
      if(vm.app.isAuthenticated($localStorage["local-setting"] && $localStorage["local-setting"].accessToken && $localStorage["local-setting"].expire && moment($localStorage["local-setting"].expire).toDate() > new Date())){
          $state.go("profile")
      }

      vm.codeString = '发送验证码'
      var pramasLit = window.location.search.substring(1).split(/&/)

      var pramas = {}
      for (var i = 0; i < pramasLit.length; i++){
          var r = pramasLit[i].split(/=/)
          if(r.length == 2){
              pramas[r[0]] = r[1]
          }
      }
          var code = pramas.code

      if((!$localStorage["local-setting"] || !$localStorage["local-setting"].accessToken ||  !$localStorage["local-setting"].expire || moment($localStorage["local-setting"].expire).toDate() < new Date()) && !code && SeUtil.isWechatBrowser()){
          var state = $location.search().state
          //$window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3cb154669646f311&redirect_uri=http://jcservice.nat300.top/%23/signin&response_type=code&scope=snsapi_base&state='+state+'#wechat_redirect';
          $window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe046330b69c05b15&redirect_uri=http://alextest.nat300.top/%23/signin&response_type=code&scope=snsapi_base&state='+state+'#wechat_redirect';
          return
      }
      console.log('code')

      if(code){
          $('#loadingToast').fadeIn(100);
          httpService.wechatOpenId({code: code}, function(result){
              vm.openId = result.openid
              httpService.wechatAuth({openId: result.openid}, function(data){
                  vm.app.setAccessToken(data)
                  vm.app.init()
                  var state = pramas.state;
                  var uri = decodeURIComponent(state);
                  $('#loadingToast').fadeOut(100);
                  console.log(uri)
                  $location.path(uri).replace();
                  console.log("expire")
                  console.log(data.expire)
              }, function(data){
                  $('#loadingToast').fadeOut(100);
                  console.info(data);
              })
          }, function(r){
              console.log(err)
              $('#loadingToast').fadeOut(100);
          })
      }

      vm.getCode = function(){
          var phone = $('#phone').val()
          if(!phone || !(/^1[2|3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(phone))){
              toastr.error('请输入正确的手机号')
              return
          }
          if(vm.waiting){
              return
          }
          vm.waiting = true
          var second = 59
          vm.codeString=second+"s后重发";
          var timerHandler =$interval(function(){
              if(second<=1){
                  $interval.cancel(timerHandler);    //当执行的时间59s,结束时，取消定时器 ，cancle方法取消
                  second=59;
                  vm.codeString="获取验证码";
                  vm.waiting=false;    //因为 ng-disabled属于布尔值，设置按钮可以点击，可点击发送
              }else{
                  second--;
                  vm.codeString=second+"s后重发";
              }
          },1000)

          console.log(phone)
          httpService.sendAuthCode({phone: phone}, function(r){
              console.log(r)
              toastr.success('发送成功')
          }, function(r){
              console.log(r)
          })
      }

    $scope.showMe = function(){
      $('#LoginTips').fadeIn(200)
    };

    $scope.hideMe = function(){
      $('#LoginTips').fadeOut(200)
    };

    $scope.bind = function (username, password) {
        var phone = $('#phone').val()
        var employeeId = $('#employeeId').val()
        var code = $('#code').val()
        if(!employeeId){
            toastr.error('请输入您的员工编号')
            return
        }
        if(!phone || !(/^1[2|3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(phone))){
            toastr.error('请输入正确的手机号')
            return
        }
        if(!code || !(/^\d{6}$/.test(code))){
            toastr.error('请输入正确的动态验证码')
            return
        }
        $('#loadingToast').fadeIn(100)

        httpService.wechatBind({
            employeeId: employeeId,
            phone: phone,
            code: code,
            openId: vm.openId
        }, function(data){
            vm.app.setAccessToken(data)
            vm.app.init()
            var state = pramas.state;
            var uri = decodeURIComponent(state)
            $('#loadingToast').fadeIn(100);
            $location.path(uri).replace()
            toastr.success('绑定成功')
        }, function(r){
            $('#loadingToast').fadeOut(100)
            toastr.error(r.message)
        })

    }
  }

})();
