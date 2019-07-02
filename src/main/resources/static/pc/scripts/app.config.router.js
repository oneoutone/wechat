/**
 * Created by Joe on 7/26/16.
 */

(function() {
    'use strict';
    angular
        .module('app')
        .run(runBlock)
        .config(config);

    runBlock.$inject = ['$rootScope', '$state', '$stateParams'];
    function runBlock($rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }

    config.$inject =  ['$stateProvider', '$urlRouterProvider', 'MODULE_CONFIG', '$httpProvider'];

    function config( $stateProvider,   $urlRouterProvider,   MODULE_CONFIG, $httpProvider ) {

        $httpProvider.interceptors.push(function($q, $location) {
            return {
                responseError: function(rejection) {
                    if (rejection.status == 401) {
                        // Now clearing the loopback values from client browser for safe logout...
                        // LoopBackAuth.clearUser();
                        // LoopBackAuth.clearStorage();
                        // $location.nextAfterLogin = $location.path();
                        // $location.path('/access/signin');

                   }
                    console.log("401 happened")
                   return $q.reject(rejection);
                }
            };
        });

        $urlRouterProvider.otherwise('/order/list');
        $stateProvider
            .state('order', {
                url: '/order',
                template: '<div ui-view></div>'
            })
            .state('bill', {
                url: '/bill',
                templateUrl: 'views/order.html',
                controller: 'OrderCtrl',
                resolve: load(['toastr','ui.bootstrap', 'mgcrea.ngStrap', 'scripts/pc/order.js'])
            })
            .state('feedback', {
                url: '/feedback',
                templateUrl: 'views/feedback.html',
                controller: 'FeedbackCtrl',
                resolve: load(['toastr','ui.bootstrap', 'mgcrea.ngStrap', 'scripts/pc/feedback.js'])
            })
            .state('rule', {
                url: '/rule',
                templateUrl: 'views/rule_regulation.html'
            })
            .state('complain', {
                url: '/complain',
                templateUrl: 'views/complain.html',
                controller: 'ComplainCtrl',
                resolve: load(['toastr','ui.bootstrap', 'mgcrea.ngStrap', 'scripts/pc/complain.js'])
            })
            .state('letter', {
                url: '/letter',
                templateUrl: 'views/letter.html',
                controller: 'LetterCtrl',
                resolve: load(['toastr','ui.bootstrap', 'mgcrea.ngStrap', 'scripts/pc/letter.js'])
            })
            .state('order.list', {
                url: '/list?status',
                templateUrl: 'views/order.list.html',
                controller: 'PcOrderListCtrl',
                resolve: load(['toastr', 'scripts/pc/order.list.js'])
            })
            .state('order.detail', {
                url: '/:id',
                templateUrl: 'views/order.detail.html',
                controller: 'PcOrderInfoCtrl',
                resolve: load(['toastr', 'scripts/pc/order.detail.js'])
            })
            .state('error', {
                url: '/error',
                template: '<div>验证用户登录信息失败</div>'
            })


        function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                    function( $ocLazyLoad, $q ){
                        var deferred = $q.defer();
                        var promise  = false;
                        srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                        if(!promise){
                            promise = deferred.promise;
                        }
                        angular.forEach(srcs, function(src) {
                            promise = promise.then( function(){
                                angular.forEach(MODULE_CONFIG, function(module) {
                                    if( module.name == src){
                                        src = module.module ? module.name : module.files;
                                    }
                                });
                                return $ocLazyLoad.load(src);
                            } );
                        });
                        deferred.resolve();
                        return callback ? promise.then(function(){ return callback(); }) : promise;
                    }]
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
