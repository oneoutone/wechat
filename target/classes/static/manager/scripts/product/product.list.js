// code style: https://github.com/johnpapa/angular-styleguide

(function() {
    'use strict';
    angular
        .module('app')
        .config(function(toastrConfig) {
            angular.extend(toastrConfig,
                {positionClass: 'toast-top-full-width',
                    preventOpenDuplicates: true,
                    timeOut: 2000
                });
        })
        .controller('ProductListCtrl', ProductListCtrl);

    ProductListCtrl.$inject = ['$scope', '$state', '$timeout', 'toastr', 'httpService'];

    function ProductListCtrl($scope, $state, $timeout, toastr, httpService){
        var vm = $scope;

    }
})();
