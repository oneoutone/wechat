(function() {
    'use strict';

    angular
        .module('app')  //对应项目的module 请换成自己的模块名称
        .directive('swipers',swipers);

    swipers.$inject = ['$timeout'];
    function swipers($timeout) {
        return {
            restrict: "EA",
            scope: {
                data:"="
            },
            template: '<div class="swiper-container">'+
            '<div class="swiper-wrapper">'+
            '<div class="swiper-slide" ng-repeat="item in data">'+
            '<img ng-src="{{item}}" />'+
            '</div>'+
            '</div>'+
            '<div class="swiper-pagination"></div>'+
            '</div>',
            link: function(scope, element, attrs) {
                $timeout(function(){
                    var swiper = new Swiper('.swiper-container', {   //轮播图绑定样式名
                        el: '.swiper-pagination',
                    });
                },100);
            }
        };
    }
})();