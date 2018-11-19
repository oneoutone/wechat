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

    $httpProvider.interceptors.push(function($q, $location, $localStorage) {
      return {
        responseError: function(rejection) {
          if (rejection.status == 401) {
              var url = $location.path();
              var from = encodeURIComponent(url);
              // 如果已经在登陆界面，接收到401跳转到登陆界面了。
              $localStorage["local-setting"].accessToken = undefined
              $localStorage["local-setting"].user = undefined
              //event.preventDefault();
              $location.path('/signin').search('state=' + from);
          }
          return $q.reject(rejection);
        }
      };
    });

    $urlRouterProvider.otherwise('/orders/list');

    $stateProvider
      .state('signin', {
        url: '/signin',
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
            templateUrl: 'views/order/order.add1.html',
            controller: 'OrderAddCtrl',
            resolve: load(['toastr', 'scripts/controllers/order/order.add1.js'])
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
        .state('score', {
            url: '/score',
            templateUrl: 'views/product/score.info.html'
        })
        .state('product', {
            url: '/product',
            template: '<div ui-view></div>'
        })
        .state('product.list', {
            url: '/list',
            templateUrl: 'views/product/product.list.html',
            controller: 'ProductListCtrl',
            resolve: load(['moment', 'se.util', 'scripts/controllers/product/product.list.js'])
        })
        .state('redeemList', {
            url: '/redeemList',
            templateUrl: 'views/product/redeem.list.html',
            controller: 'RedeemListCtrl',
            resolve: load(['moment', 'se.util', 'scripts/controllers/product/redeem.list.js'])
        })
        .state('scoreList', {
            url: '/scoreList',
            templateUrl: 'views/product/score.list.html',
            controller: 'ScoreListCtrl',
            resolve: load(['moment', 'se.util', 'scripts/controllers/product/score.list.js'])
        })
        .state('product.info', {
            url: '/:id',
            templateUrl: 'views/product/product.info.html',
            controller: 'ProductInfoCtrl',
            resolve: load(['moment', 'se.util', 'toastr', 'scripts/controllers/product/product.info.js'])
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
