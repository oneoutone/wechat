/**
 * Created by Joe on 7/26/16.
 */

// lazyload config
(function() {
    'use strict';
    angular
        .module('app')
        .constant('MODULE_CONFIG', [
            {
                name: 'moment',
                module: false,
                files: [
                    '../../libs/js/moment/min/moment-with-locales.min.js'
                ]
            },{
                name: 'polygonizr',
                module: false,
                files: [
                    '../../libs/js/polygonizr.min.js'
                ]
            }
        ])
        .config(['$ocLazyLoadProvider', 'MODULE_CONFIG', function($ocLazyLoadProvider, MODULE_CONFIG) {
            $ocLazyLoadProvider.config({
                debug: false,
                events: false,
                modules: MODULE_CONFIG
            });
        }]);


})();
