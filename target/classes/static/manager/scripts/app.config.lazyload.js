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
                    // 'libs/angular/angular-bootstrap/ui-bootstrap-tpls.min.js'
                    '//cdn.bootcss.com/angular-ui-bootstrap/2.5.0/ui-bootstrap-tpls.js'
                ]
            },
            {
                name: 'ngTagsInput',
                module: true,
                files: [
                    '../libs/angular/ng-tags-input/ng-tags-input.min.js',
                    '../libs/angular/ng-tags-input/ng-tags-input.min.css'
                ]
            },


            {
                name: 'mgcrea.ngStrap',
                module: true,
                serie: true,
                files: [
                    '../../assets/angular-motion/dist/angular-motion.min.css',
                    '../../assets/bootstrap-additions/dist/bootstrap-additions.min.css',
                    '../../libs/angular/angular-strap/dist/angular-strap.min.js',
                    '../../libs/angular/angular-strap/dist/angular-strap.tpl.min.js'
                ]
            },
            {
                name: 'ui.select',
                module: true,
                files: [
                    '../../libs/angular/angular-ui-select/dist/select.min.js',
                    '../../libs/angular/angular-ui-select/dist/select.min.css'
                ]
            },
            {
                name: 'smart-table',
                module: true,
                files: [
                    '../../libs/angular/angular-smart-table/dist/smart-table.min.js'
                ]
            },
            {
                name: 'xeditable',
                module: true,
                files: [
                    '../../libs/angular/angular-xeditable/dist/js/xeditable.min.js',
                    '../../libs/angular/angular-xeditable/dist/css/xeditable.css'
                ]
            },
            {
                name: 'dataTable',
                module: false,
                files: [
                    '../../libs/jquery/datatables/media/js/jquery.dataTables.min.js',
                    '../../libs/jquery/plugins/integration/bootstrap/3/dataTables.bootstrap.js',
                    '../../libs/jquery/plugins/integration/bootstrap/3/dataTables.bootstrap.css'
                ]
            },
            {
                name: 'ng-strap',
                module: true,
                serie: true,
                files: [
                    '../../libs/angular/angular-strap/dist/angular-strap.min.js',
                    '../../libs/angular/angular-strap/dist/angular-strap.tpl.min.js'
                ]
            },
            {
                name: 'footable',
                module: false,
                files: [
                    '../../libs/jquery/footable/compiled/footable.min.js',
                    '../../libs/jquery/footable/compiled/footable.bootstrap.min.css'
                ]
            },
            {
                name: 'ngFileUpload',
                module: true,
                files: [
                    '../../libs/angular/ng-file-upload/ng-file-upload.min.js'
                ]
            },
            {
                name: 'moment',
                module: false,
                files: [
                    '../../libs/js/moment/min/moment-with-locales.min.js'
                ]
            },
            {
                name: 'papaparse',
                module: false,
                files: [
                    '../../libs/js/papaparse/papaparse.min.js'
                ]
            },
            {
                name: 'XLSX',
                module: false,
                files: [
                    '../../libs/js/js-xlsx/dist/xlsx.core.min.js'
                ]
            },
            {
                name: 'L_XLSX',
                module: false,
                files: [
                    '../../libs/js/l_xlsx/l_xlsx.js'
                ]
            },
            {
                name: 'toastr',
                module: true,
                files: [
                    '../libs/angular/angular-toastr/dist/angular-toastr.tpls.js',
                    '../libs/angular/angular-toastr/dist/angular-toastr.min.css'
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
