/**
 * Created by Joe on 9/13/16.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .run(runBlock)
    .config(config);

  runBlock.$inject = ['$rootScope', '$state', '$stateParams', '$log'];

  function runBlock($rootScope, $state, $stateParams, $log) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      // we cannot distinguish history "back" and "forward", so if possible, can using this alternative way
      // using data instead program for history back


    });
  }

  config.$inject = ['$stateProvider', '$urlRouterProvider', 'MODULE_CONFIG',  '$httpProvider'];

  function config($stateProvider, $urlRouterProvider, MODULE_CONFIG, $httpProvider) {

    $httpProvider.interceptors.push(function($q, $location, LoopBackAuth) {
      return {
        responseError: function(rejection) {
          if (rejection.status == 401) {
            // console.info("401 occ");
            // //Now clearing the loopback values from client browser for safe logout...
            // LoopBackAuth.clearUser();
            // LoopBackAuth.clearStorage();
            // var url = $location.path();
            // var from = encodeURIComponent(url);
            // console.log(url);
            // var operator = url.split("/")[2];
            // // 如果已经在登陆界面，接收到401跳转到登陆界面了。
            // if (url.indexOf('signIn') == -1) {
            //   $location.path('o/'+operator+'/signIn').search('state=' + from);
            // }
          }
          return $q.reject(rejection);
        }
      };
    });

    $urlRouterProvider.otherwise('/orders');

    $stateProvider
      .state('signIn', {
        url: '/signIn?state',
        templateUrl: 'views/signin/signIn.html',
        controller: 'SignInCtrl',
        resolve: load(['moment', 'toastr', 'se.util', 'scripts/controllers/signIn.js'])
      })

      .state('order', {
        url: '/orders',
        template: '<div ui-view></div>'
      })

      .state('order.list', {
        url: '/list?status',
        templateUrl: 'views/order/order.list.html',
        controller: 'OrderListCtrl',
        resolve: load(['moment', 'se.util', 'scripts/controllers/order/order.list.js'])
      })

        .state('order.info', {
            url: '/info?id',
            templateUrl: 'views/order/order.info.html',
            controller: 'OrderInfoCtrl',
            resolve: load(['moment', 'toastr', 'scripts/controllers/order/order.info.js'])
        })

        .state('order.add', {
            url: '/add',
            templateUrl: 'views/order/order.add.html',
            controller: 'OrderAddCtrl',
            resolve: load(['toastr', 'scripts/controllers/order/order.add.js'])
        })

        .state('order.reply', {
            url: '/reply?id',
            templateUrl: 'views/order/order.reply.html',
            controller: 'OrderReplyCtrl',
            resolve: load(['toastr', 'scripts/controllers/order/order.reply.js'])
        })

        .state('profile', {
            url: '/profile',
           templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl',
            resolve: load(['toastr', 'se.util', 'moment', 'scripts/controllers/profile.js'])
         })



        // 运营团队权限配置
        .state('app.manager',{
            url: '/managers',
            template: '<div ui-view></div>',
            data: {title: '管理团队'}
        })
        .state('app.manager.list', {
            url: '/list',
            templateUrl: 'views/manager/manager.list.html',
            controller: "ManagerListCtrl",
            resolve: load(['toastr', 'ngFileUpload', 'L_XLSX', 'XLSX', 'ui.bootstrap','footable', 'scripts/manager/manager.list.js'])
        })
        .state('app.manager.info', {
            url: '/list',
            templateUrl: 'views/manager/manager.info.html',
            controller: "ManagerInfoCtrl",
            resolve: load(['toastr', 'ngFileUpload', 'scripts/manager/manager.info.js'])
        })

      // 会议预约
      .state('operator.meeting', {
        url: '/meetings',
        template: '<div ui-view></div>',
        data: { title: '会议室管理' }
      })
      .state('operator.meeting.grid', {
        url: '/grid?date',
        params: {"param": null, "time": null, "offsetx": null, "offsety": null},
        templateUrl: '../m.views/meetings/meeting.grid.html',
        controller: "MeetingGirdCtrl",
        resolve: load(['moment', 'mobiscroll', '../scripts/m.controllers/meeting/meeting.grid.js'])
      })
      .state('operator.meeting.info', {
        url: '/:id',
        params: {"param": null, "offsetx": null, "offsety": null},
        templateUrl: '../m.views/meetings/meeting.info.html',
        //templateUrl: '../m.views/meetings/meetings.detail.m.html',
        controller: 'BookingFormCtrl',
        resolve: load(['moment', 'toastr', 'mobiscroll', 'Decimal', '../scripts/m.controllers/meeting/meeting.info.js'])
      })


      .state('menu', {
        url: '/menu',
        templateUrl: '../m.views/menu.html',
        controller: 'MenuCtrl',
        resolve: load(['ui.bootstrap', 'swiper', '../scripts/m.controllers/menu.js'])
      })
      .state('operator.feedback', {
        url: '/feedback/:id',
        templateUrl: '../m.views/feedback.html',
        controller: 'FeedbackCtrl',
        resolve: load(['moment', 'toastr', '../scripts/m.controllers/feedback.js'])
      })
      .state('operator.password', {
        url: '/password',
        templateUrl: '../m.views/settings/password.html',
        controller: "PasswordCtrl",
        resolve: load(['toastr', '../scripts/m.controllers/password.js'])
      })


    function load(srcs, callback) {
      return {
        deps: ['$ocLazyLoad', '$q',
          function($ocLazyLoad, $q) {
            var deferred = $q.defer();
            var promise = false;
            srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
            if (!promise) {
              promise = deferred.promise;
            }
            angular.forEach(srcs, function(src) {
              promise = promise.then(function() {
                angular.forEach(MODULE_CONFIG, function(module) {
                  if (module.name == src) {
                    src = module.module ? module.name : module.files;
                  }
                });
                return $ocLazyLoad.load(src);
              });
            });
            deferred.resolve();
            return callback ? promise.then(function() {
              return callback();
            }) : promise;
          }
        ]
      }
    }

    function getParams(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  }

})();
