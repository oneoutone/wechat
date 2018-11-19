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
        name: 'ui.bootstrap',
        module: true,
        serie: true,
        files: [
          '../libs/angular/angular-bootstrap/ui-bootstrap-tpls.min.js'
        ]
      },
      {
        name: 'se.util',
        module: true,
        files: [
          '../scripts/services/util.js'
        ]
      },
      {
        name: 'moment',
        module: false,
        files: [
          '../libs/js/moment/min/moment-with-locales.min.js'
        ]
      },
      {
        name: 'toastr',
        module: true,
        files: [
          '../libs/angular/angular-toastr/dist/angular-toastr.tpls.min.js',
          '../libs/angular/angular-toastr/dist/angular-toastr.min.css'
        ]
      },
      {
        name: 'weui+',
        module: true,
        files: [
          '../assets/weui+/weuix.min.css',
        ]
      },
      {
        name: 'mobiscroll',
        module: true,
        files: [
          '../libs/js/mobiscroll/mobiscroll.custom-3.0.0-beta2.min.js',
          '../libs/js/mobiscroll/mobiscroll.custom-3.0.0-beta2.min.css'
        ]
      },
    {
      name: 'swiper',
        module: false,
      files: [
      '../assets/swiper/dist/css/swiper.min.css',
      '../libs/js/swiper/dist/js/swiper.jquery.min.js'
    ]
    },
      {
        name: 'Decimal',
        module: false,
        files: [
          '../libs/js/decimal/decimal.js'
        ]
      },
        {
            name: 'httpServer',
            module: true,
            files: [
                '../scripts/services/ajax.js'
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
