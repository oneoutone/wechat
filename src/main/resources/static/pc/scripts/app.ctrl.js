/**
 * @ngdoc function
 * @name app.controller:AppCtrl
 * @description
 * # MainCtrl
 * Controller of the app
 */

(function() {
    'use strict';
    angular
        .module('app')
        .controller('AppCtrl', AppCtrl);

    AppCtrl.$inject  = [ '$scope', '$localStorage', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window', '$state', 'httpService' ];

    function AppCtrl( $scope, $localStorage, $location, $rootScope, $anchorScroll, $timeout, $window, $state, httpService) {

        var vm = $scope
        var setting = 'local-setting';
        //var url = 'http://192.168.1.97/'
        var url = 'http://10.100.30.240:3000/'
        vm.app = {
            name: '锦创微服务',
            url: url,
            host: url+'api',
            user:{},
            setting: {}
        }

        var search = $location.search()

        vm.app.isAuthenticated = function(){
            var now = new Date()
            console.log(vm.app.setting.expire)
            console.log(vm.app.setting.accessToken)
            console.log('expire')
            console.log($localStorage[setting])
            if($localStorage[setting] && $localStorage[setting].accessToken && now < moment($localStorage[setting].expire).toDate()){
                return true
            }
            return false
        }

        vm.app.setUser = function(user){
            console.log('set user')
            vm.app.setting.accessToken = user.accessToken
            vm.app.setting.userId = user.userId
            vm.app.setting.expire = user.expire
            $localStorage[setting].accessToken = user.accessToken
            $localStorage[setting].expire = user.expire
            $localStorage[setting].user = user.userId
        }
        /**
         * 程序初始化使用。使用方法
         *
         * vm.app.ready(function() {
     *  // insert your code here.
     * })
         *
         */
        vm.app.isReady = false;    // 程序是否初始化成功
        var todos = [];
        vm.app.ready = function(func) {
            if (vm.app.isReady) { return func(); }
            todos.push(func);
        };
        vm.app.runTodos = function() {
            for (var i = 0; i < todos.length; i++) {
                todos[i]();
            }
        };


        $rootScope.$on('$stateChangeStart', function (event, toState) {
            // console.log('gogogo')
            console.log(toState)
            if(toState != 'error' && !vm.app.isAuthenticated() && (!search || !search.accessToken)){
                $state.go('error');
            }
        });

        /**
         * 初始化程序，
         *
         * @param next
         */
        vm.app.init = function (callback) {
            httpService.getMyProfile(function(data){
                vm.app.setting.user = data
                vm.app.isReady = true
                vm.app.runTodos()
                if(callback){
                    callback()
                }
            }, function(err){
                console.log(err)
            })
        };

        vm.app.logout = function () {
            vm.app.setting.accessToken = undefined
            vm.app.setting.expire = undefined
            vm.app.setting.user = undefined
            $localStorage[setting].accessToken = undefined
            $localStorage[setting].expire = undefined
            $localStorage[setting].user = undefined
            $location.path('/access/signin');
        };

        vm.app.close = function(){
            window.close()
        }

        console.log(setting)
        // save settings to local storage
        if (angular.isDefined($localStorage[setting])) {
            vm.app.setting = $localStorage[setting];
        }
        // watch changes
        $scope.$watch('app.setting', function () {
            $localStorage[setting] = vm.app.setting;
        }, true);

        // if((search && search.accessToken)) {
        //     httpService.checkToken(search.accessToken, function (accessToken) {
        //         if (!accessToken) {
        //             $state.go('error');
        //         }
        //         vm.app.setUser(accessToken)
        //         vm.app.init()
        //     }, function (err) {
        //         console.log(err)
        //         $state.go('error');
        //     })
        // }

        if(!vm.app.isAuthenticated() && (!search || !search.accessToken)){
            console.log("auth 1")
            $state.go('error');
        }else if(search && search.accessToken){
            console.log("auth 2")
            httpService.checkToken(search.accessToken, function(accessToken){
                if(!accessToken){
                    $state.go('error');
                }
                vm.app.setUser(accessToken)
                vm.app.init()
            }, function(err){
                console.log(err)
                $state.go('error');
            })
        }else if(vm.app.isAuthenticated()){
            console.log("auth 3")
            console.log(vm.app.setting.accessToken)
            vm.app.init()
        }

    }
})();
