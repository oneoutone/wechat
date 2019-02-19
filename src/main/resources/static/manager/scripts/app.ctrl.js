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
        var vm = $scope;
        /**
         * Usage:
         * vm.log('error', 'this is a test message');
         *
         */

        $rootScope.miniSidebarActive = true;

        vm.app = {
            name: '锦创科技微服务后台',
            version: '0.6.0',
            // for chart colors
            color: {
                'primary': '#0cc2aa',
                'accent': '#a88add',
                'warn': '#fcc100',
                'info': '#6887ff',
                'success': '#6cc788',
                'warning': '#f77a99',
                'danger': '#f44455',
                'white': '#ffffff',
                'light': '#f1f2f3',
                'dark': '#2e3e4e',
                'black': '#2a2b3c'
            },
            setting: {
                theme: {
                    primary: 'blue',
                    accent: 'indigo',
                    warn: 'primary'
                },
                folded: false,
                boxed: false,
                container: false,
                themeID: 1,
                bg: ''
            }
        };

        vm.app.isAuthenticated = function(){
            var now = new Date()
            if(vm.app.setting && vm.app.setting.accessToken && vm.app.setting.expire && now < new Date(vm.app.setting.expire)){
                return true
            }
            return false
        }
        vm.app.roles = {};
        vm.app.spaces = [];
        vm.app.user = {};

        vm.app.setUser = function(user){
            vm.app.setting.accessToken = user.accessToken
            vm.app.setting.userId = user.userId
            vm.app.setting.expire = user.expire
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
            //console.info( LoopBackAuth.currentUserData)
            if (!vm.app.isAuthenticated() && toState.name.indexOf('access.') == -1) {
                event.preventDefault();
                $state.go('access.signin');
                return
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
                vm.app.setting.user.roles = {}
                if(data.managerRoles){
                    var roles = data.managerRoles.split(',')
                    for(var i=0; i<roles.length; i++){
                        vm.app.setting.user.roles[roles[i]] = true
                    }
                }
                vm.app.isReady = true
                vm.app.runTodos()
                if(callback){
                    callback()
                }
            }, function(err){
                console.log(err)
            })

            // // Step 1: 获取用户基本信息
            // User.getCurrent(function (user) {
            //     vm.app.user = user;
            //     // step 2: 获取用户角色
            //     getRoles(function (err, roles) {
            //         console.log('roles');
            //         console.log(roles);
            //         vm.app.roles = roles;
            //         // Step 3: 判断是管理员还是入驻会员，进行不同的初始化工作
            //         if (vm.app.roles.office || vm.app.roles.admin) {
            //             vm.app.navUrl = '../views/blocks/nav.html';
            //             vm.app.setting.loginType = 'spaceManager';
            //             // Step 3.1: 获取管理的空间
            //             // Step 3.1: 获取管理的空间
            //             User.prototype$__get__spaces({id: 'me'}, function(spaces){
            //                 vm.app.spaces = spaces;
            //                 if (!vm.app.setting.spaceId) {
            //                     vm.app.setting.spaceId = spaces[0].id;
            //                     vm.app.setting.openSeatPrice = spaces[0].openSeatPrice ?  spaces[0].openSeatPrice : 1000;
            //                     vm.app.setting.officeSeatPrice = spaces[0].officeSeatPrice ?  spaces[0].officeSeatPrice : 1200;
            //                     vm.app.setting.depositTimes = spaces[0].depositTimes ?  spaces[0].depositTimes : 1
            //                 }else{
            //                     var savedSpace = spaces.filter(function(item){
            //                         return item.id ==  vm.app.setting.spaceId
            //                     });
            //                     var currentSpace = savedSpace[0];
            //                     vm.app.setting.openSeatPrice = currentSpace.openSeatPrice ?  currentSpace.openSeatPrice : 1000;
            //                     vm.app.setting.officeSeatPrice = currentSpace.officeSeatPrice ?  currentSpace.officeSeatPrice : 1200;
            //                     vm.app.setting.depositTimes = currentSpace.depositTimes ?  currentSpace.depositTimes : 1
            //                 }
            //                 console.log('spaceId', vm.app.setting.spaceId);
            //                 vm.app.setting.operatorId = spaces[0].operatorId;
            //                 // Step 3.2: 获取没完成的feedback 和 没有阅读的notification
            //                 vm.app.feedBackNum();
            //                 vm.app.unreadNotification();
            //                 vm.app.isReady = true;
            //                 vm.app.runTodos();
            //                 if (typeof next === 'function') { return next() }
            //             })
            //         } else {
            //             // 如果是team manager
            //             vm.app.navUrl = '../team/views/blocks/nav.html';
            //             vm.app.setting.loginType = 'teamManager';
            //             Team.findById({id: vm.app.user.teamId, filter: {include: 'space'}}, function (team) {
            //                 vm.app.spaces = [team.space];
            //                 vm.app.setting.spaceId = team.space.id;
            //                 vm.app.setting.operatorId = team.space.operatorId;
            //                 vm.app.setting.team = team;
            //                 vm.isReady = true;
            //                 vm.app.runTodos();
            //                 if (typeof next === 'function') { return next() }
            //             }, function (err) {
            //                 console.error(err)
            //             })
            //         }
            //     }, function (err) {
            //         console.error(err)
            //     });
            // }, function (err) {
            //     console.error(err);
            //     event.preventDefault();
            //     vm.app.logout();
            // });
        };

        vm.isIE = isIE();
        vm.isSmart = isSmart();
        // config

        vm.app.logout = function () {
            vm.app.setting.accessToken = undefined
            vm.app.setting.expire = undefined
            vm.app.setting.user = undefined
            $localStorage[setting].accessToken = undefined
            $localStorage[setting].expire = undefined
            $localStorage[setting].user = undefined
            $location.path('/access/signin');
        };

        var setting = 'local-setting';
        console.log(setting)
        // save settings to local storage
        if (angular.isDefined($localStorage[setting])) {
            vm.app.setting = $localStorage[setting];
        } else {
            $localStorage[setting] = vm.app.setting;
        }
        // watch changes
        $scope.$watch('app.setting', function () {
            $localStorage[setting] = vm.app.setting;
        }, true);

        getParams('bg') && (vm.app.setting.bg = getParams('bg'));
        vm.setTheme = setTheme;
        setColor();

        function setTheme(theme) {
            vm.app.setting.theme = theme.theme;
            setColor();
            if (theme.url) {
                $timeout(function () {
                    $window.location.href = theme.url;
                }, 100, false);
            }
        }

        function setColor() {
            vm.app.setting.color = {
                primary: getColor(vm.app.setting.theme.primary),
                accent: getColor(vm.app.setting.theme.accent),
                warn: getColor(vm.app.setting.theme.warn)
            };
        }

        function getColor(name) {
            return vm.app.color[name] ? vm.app.color[name] : palette.find(name);
        }


        vm.goBack = function () {
            $window.history.back();
        };

        function isIE() {
            return !!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident.*rv:11\./);
        }

        function isSmart() {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        function getParams(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        /**
         * get user roles and convert to {admin: true, executive: true} format
         *
         * @param callback
         */

        vm.app.init();

    }
})();
