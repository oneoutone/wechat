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
      'lbServices',
        'myAjax'
    ])
  .config(["$locationProvider", function($locationProvider) {
    $locationProvider.html5Mode(false);
  }])
  .run(['$rootScope', 'User', '$state', '$stateParams', '$location', '$timeout', function ($rootScope, User, $state, $stateParams, $location, $timeout) {

    // var url = $location.path();
    //
    // if (!User.isAuthenticated() && url.indexOf('signIn') === -1
    //   && url.indexOf('menu') === -1 && url.indexOf('open') === -1
    //   && url.indexOf('policy') === -1 && url.indexOf('service') === -1
    //   && url.indexOf('password') === -1 && url.indexOf('verify') === -1) {
    //
    //   // 需要跳转的url
    //   var from = encodeURIComponent(url);
    //
    //   if (url.indexOf('/o/') !== -1) {
    //     var operatorId = url.substr(3, 24);
    //     $timeout(function() {
    //       $state.go('operator.signIn', {operatorId: operatorId, state: from})
    //     }, 50);
    //   } else {
    //     $timeout(function() {
    //       $state.go('operator.signIn', {state: from})
    //     }, 50);
    //   }

    //}

   }]);
})();
