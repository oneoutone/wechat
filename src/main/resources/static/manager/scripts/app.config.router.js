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

        $httpProvider.interceptors.push(function($q, $location, LoopBackAuth) {
            return {
                responseError: function(rejection) {
                    if (rejection.status == 401) {
                        // Now clearing the loopback values from client browser for safe logout...
                        // LoopBackAuth.clearUser();
                        // LoopBackAuth.clearStorage();
                        // $location.nextAfterLogin = $location.path();
                        // $location.path('/access/signin');
                        console.log("401 happened")
                   }
                   return $q.reject(rejection);
                }
            };
        });

        $urlRouterProvider.otherwise('/access/signin');
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                views: {
                    '': {
                        templateUrl: 'views/layout/layout.html'
                    }
                }
            })
            .state('access', {
                url: '/access',
                template: '<div class="dark bg-auto w-full"><div ui-view class="fade-in-right-big smooth pos-rlt"></div></div>'
            })
            .state('access.signin', {
                url: '/signin',
                templateUrl: 'views/signin/signin.html',
                controller: "SignInCtrl",
                resolve: load(['toastr', 'scripts/signin/signin.js'])
            })
            .state('access.signup', {
                url: '/signup',
                templateUrl: 'views/signIn/signup.html',
                controller: "SignUpCtrl",
                resolve: load(['toastr', 'scripts/controllers/signin/signup.js'])
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
                url: '/info/:id',
                templateUrl: 'views/manager/manager.info.html',
                controller: "ManagerInfoCtrl",
                resolve: load(['toastr', 'scripts/manager/manager.info.js'])
            })

            .state('app.product',{
                url: '/product',
                template: '<div ui-view></div>',
                data: {title: '礼品管理'}
            })
            .state('app.product.list', {
                url: '/list?name&status&saleStatus&start&end&page',
                templateUrl: 'views/product/product.list.html',
                controller: "ProductListCtrl",
                resolve: load(['toastr', 'moment', 'mgcrea.ngStrap', 'scripts/product/product.list.js'])
            })
            .state('app.product.detail', {
                url: '/detail?id',
                templateUrl: 'views/product/product.detail.html',
                controller: "ProductDetailCtrl",
                resolve: load(['toastr', 'moment', 'ngFileUpload', 'mgcrea.ngStrap', 'scripts/product/product.detail.js'])
            })
            .state('app.product.info', {
                url: '/:id',
                templateUrl: 'views/product/product.info.html',
                controller: "ProductInfoCtrl",
                resolve: load(['toastr', 'moment', 'ngFileUpload', 'mgcrea.ngStrap', 'scripts/product/product.info.js'])
            })
            .state('app.confirm',{
                url: '/confirm',
                template: '<div ui-view></div>',
                data: {title: '礼品审核'}
            })
            .state('app.confirm.list', {
                url: '/list?id&name&status&page',
                templateUrl: 'views/product/confirm/confirm.list.html',
                controller: "ConfirmListCtrl",
                resolve: load(['toastr', 'moment', 'mgcrea.ngStrap', 'scripts/product/confirm/confirm.list.js'])
            })
            .state('app.confirm.info', {
                url: '/info?id',
                templateUrl: 'views/product/confirm/confirm.info.html',
                controller: "ConfirmInfoCtrl",
                resolve: load(['toastr', 'moment', 'mgcrea.ngStrap', 'scripts/product/confirm/confirm.info.js'])
            })
            .state('app.redeem',{
                url: '/redeem',
                template: '<div ui-view></div>',
                data: {title: '兑换订单'}
            })
            .state('app.redeem.list', {
                url: '/list?org&productName&employeeId&start&end&page',
                templateUrl: 'views/product/redeem.list.html',
                controller: "RedeemListCtrl",
                resolve: load(['toastr', 'moment', 'XLSX', 'mgcrea.ngStrap', 'scripts/product/redeem.list.js'])
            })
            .state('app.redeem.info', {
                url: '/info?id',
                templateUrl: 'views/product/redeem.info.html',
                controller: "RedeemInfoCtrl",
                resolve: load(['toastr', 'moment', 'mgcrea.ngStrap', 'scripts/product/redeem.info.js'])
            })

            .state('app.company',{
                url: '/company',
                template: '<div ui-view></div>',
                data: {title: '企业列表'}
            })

            .state('app.company.list', {
                url: '/list?status&index',
                templateUrl: 'views/meeting/company.list.html',
                controller: "CompanyListCtrl",
                resolve: load(['toastr', 'moment','ui.bootstrap', 'scripts/meeting/company.list.js'])
            })

            .state('app.building',{
                url: '/building',
                template: '<div ui-view></div>',
                data: {title: '楼宇列表'}
            })
            .state('app.building.list', {
                url: '/list',
                templateUrl: 'views/meeting/building.list.html',
                controller: "BuildingListCtrl",
                resolve: load(['toastr', 'moment','ui.bootstrap', 'scripts/meeting/building.list.js'])
            })

            .state('app.employee',{
                url: '/employee',
                template: '<div ui-view></div>',
                data: {title: '员工列表'}
            })
            .state('app.employee.list', {
                url: '/list?companyId&index',
                templateUrl: 'views/meeting/employee.list.html',
                controller: "EmployeeListCtrl",
                resolve: load(['toastr', 'moment','ui.bootstrap', 'scripts/meeting/employee.list.js'])
            })

            .state('app.meetingRoom',{
                url: '/meetingRoom',
                template: '<div ui-view></div>',
                data: {title: '会议室列表'}
            })
            .state('app.meetingRoom.list', {
                url: '/list',
                templateUrl: 'views/meeting/meetingRoom.list.html',
                controller: "MeetingRoomListCtrl",
                resolve: load(['toastr', 'moment','ui.bootstrap', 'scripts/meeting/meetingRoom.list.js'])
            })
            .state('app.meeting',{
                url: '/meeting',
                template: '<div ui-view></div>',
                data: {title: '会议室列表'}
            })
            .state('app.meeting.grid', {
                url: '/grid',
                templateUrl: 'views/meeting/meeting.grid.html',
                controller: "MeetingGirdCtrl",
                resolve: load(['toastr', 'moment','mgcrea.ngStrap','ui.select', 'scripts/meeting/meeting.grid.js'])
            })

            // 会议预约
            .state('wechatMeeting', {
                url: '/wechatMeeting',
                template: '<div ui-view></div>',
                data: { title: '会议室管理' }
            })
            .state('wechatMeeting.grid', {
                url: '/grid?buildingId',
                params: {"param": null, "time": null, "offsetx": null, "offsety": null},
                templateUrl: 'views/meeting/meeting.wechat.grid.html',
                controller: "MeetingWechatGirdCtrl",
                resolve: load(['moment', 'mobiscroll', 'scripts/meeting/meeting.wechat.grid.js'])
            })
            .state('wechatMeeting.info', {
                url: '/:id?buildingId',
                params: {"param": null, "offsetx": null, "offsety": null},
                templateUrl: 'views/meeting/meeting.wechat.info.html',
                //templateUrl: '../m.views/meetings/meetings.detail.m.html',
                controller: 'BookingWechatFormCtrl',
                resolve: load(['moment', 'toastr', 'mobiscroll', 'scripts/meeting/meeting.wechat.info.js'])
            })
            .state('wechatBuilding', {
                url: '/wechatBuilding',
                template: '<div ui-view></div>',
                data: { title: '楼宇列表' }
            })
            .state('wechatBuilding.list', {
                url: '/list',
                templateUrl: 'views/meeting/building.wechat.list.html',
                controller: "WechatBuildingCtrl",
                resolve: load(['toastr', 'moment', 'mgcrea.ngStrap', 'scripts/meeting/building.wechat.list.js'])
            })
            .state('app.feedbackList', {
                url: '/feedbackList?filter&category&page',
                templateUrl: 'views/feedback/feedback.html',
                data: { title: '反馈列表' },
                controller: "FeedbackCtrl",
                resolve: load(['toastr', 'moment', 'mgcrea.ngStrap', 'scripts/feedback/feedback.js'])
            })
            .state('app.complainList', {
                url: '/complainList?filter&category&reply&page',
                templateUrl: 'views/feedback/complain.html',
                data: { title: '投诉列表' },
                controller: "ComplainCtrl",
                resolve: load(['toastr', 'moment', 'mgcrea.ngStrap', 'scripts/feedback/complain.js'])
            })
            .state('app.letterList', {
                url: '/letterList?filter&reply&page',
                templateUrl: 'views/feedback/letter.html',
                data: { title: '总裁信件列表' },
                controller: "LetterCtrl",
                resolve: load(['toastr', 'moment', 'mgcrea.ngStrap', 'scripts/feedback/letter.js'])
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
