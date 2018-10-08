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

  AppCtrl.$inject  = ['$scope', 'User', '$localStorage'];

  function AppCtrl($scope, User, $localStorage) {
    var vm = $scope;

    vm.app = {
      name: '锦创科技微服务',
      version: '0.6.0',
        host: 'http://alextest.nat300.top',
      color: {
        'primary':      '#0cc2aa',
        'accent':       '#a88add',
        'warn':         '#fcc100',
        'info':         '#6887ff',
        'success':      '#6cc788',
        'warning':      '#f77a99',
        'danger':       '#f44455',
        'white':        '#ffffff',
        'light':        '#f1f2f3',
        'dark':         '#2e3e4e',
        'black':        '#2a2b3c'
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
        bg: '',
        date: new Date()
      }
    };

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


    var setting = vm.app.name + '-m-Setting';
    // save settings to local storage
    if (angular.isDefined($localStorage[setting])) {
      vm.app.setting = $localStorage[setting];
      vm.app.team = vm.app.setting.team
    } else {
      $localStorage[setting] = vm.app.setting;
    }
    // watch changes
    $scope.$watch('app.setting', function () {
      $localStorage[setting] = vm.app.setting;
    }, true);


    /**
     * get user roles and convert to {admin: true, executive: true} format
     *
     * @param callback
     */
    // function getRoles(callback) {
    //   User.prototype$__get__roles({id: 'me'}, function (roles) {
    //     var _roles = {};
    //     for (var index = 0; index < roles.length; index ++) {
    //       var _roleName = roles[index].name;
    //       _roles[_roleName] = true;
    //     }
    //     return callback(null, _roles);
    //   }, function (err) {
    //     return callback(err)
    //   });
    // }


    /**
     * initialization
     *
     */
    // vm.app.init = function(){
    //   if (!User.getCurrentId()) {return}
    //   User.getCurrent(function (user){
    //     vm.app.user = user;
    //     vm.app.setting.spaceId = user.spaceId;
    //     getRoles(function (err, roles) {
    //       vm.app.roles = roles;
    //       vm.app.isReady = true;
    //       vm.app.runTodos();
    //     })
    //   }, function (err) {
    //     console.error(err)
    //   });
    // };
    //
    // vm.app.init();
  }
})();
