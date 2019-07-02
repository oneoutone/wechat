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

    }
})();
