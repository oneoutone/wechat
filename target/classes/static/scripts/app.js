/**
 * Created by Joe on 9/13/16.
 */

(function() {
  'use strict';
  angular
    .module('app', [
      'ngAnimate',
      'ngResource',
      'ngSanitize',
      'ngTouch',
      'ngStorage',
      'ui.router',
      'ui.utils',
      'ui.load',
      'ui.jp',
      'oc.lazyLoad',
        'myAjax'
    ])
  .config(["$locationProvider", function($locationProvider) {
    $locationProvider.html5Mode(false);
  }])
  .run(['$rootScope', '$state', '$stateParams', '$location', '$timeout', '$localStorage', function ($rootScope, $state, $stateParams, $location, $timeout, $localStorage) {
      var setting = 'local-setting';
      var login = false
      var now = new Date()
      if($localStorage[setting] && $localStorage[setting].accessToken && $localStorage[setting].expire && now < moment($localStorage[setting].expire).toDate()){
          login=true
      }

    var url = $location.path();

    if (!login && url.indexOf('signin') === -1) {

      // 需要跳转的url
      var from = encodeURIComponent(url);
      $state.go('signin', {state: from})

    }

   }]);
})();
