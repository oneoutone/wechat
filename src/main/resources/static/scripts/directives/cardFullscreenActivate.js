/**
 * Created by lzh on 13/03/2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .directive("cardFullscreenActivate", cardFullscreenActivate);
  cardFullscreenActivate.$inject = ['$rootScope', 'variables'];
  function cardFullscreenActivate($rootScope, variables) {
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      template: '<i class="md-icon material-icons md-card-fullscreen-activate" ng-click="cardFullscreenActivate($event)">&#xE5D0;</i>',
      link: function (scope, el, attrs) {
        scope.cardFullscreenActivate = function ($event) {
          $event.preventDefault();

          var $thisCard = $(el).closest('.md-card'),
            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed'),
            mdCard_h = $thisCard.height(),
            mdCard_w = $thisCard.width(),
            body_scroll_top = $('body').scrollTop(),
            mdCard_offset = $thisCard.offset();

          // create placeholder for card
          $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
          // add overflow hidden to #page_content (fix for ios)
          //$body.addClass('md-card-fullscreen-active');

          //去掉html的滚动条
          $('html').css({'padding-right':'15px','overflow': 'hidden'});
          $rootScope.chart = attrs.type;
          $rootScope.pig = true;

          // add width/height to card (preserve original size)
          $thisCard
            .addClass('md-card-fullscreen')
            .css({
              'width': mdCard_w,
              'height': mdCard_h,
              'left': mdCard_offset.left,
              'top': mdCard_offset.top - body_scroll_top
            })
            // animate card to top/left position
            .velocity({
              left: 0,
              top: 0
            },{
              duration: 400,
              easing: variables.easing_swiftOut,
              begin: function(elements) {
                $rootScope.card_fullscreen = true;
                $rootScope.hide_content_sidebar = true;
                // add back button
                //$thisCard.find('.md-card-toolbar').prepend('<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left">&#xE5C4;</span>');
                //altair_page_content.hide_content_sidebar();
              }
            })
            // resize card to full width/height
            .velocity({
              height: '100%',
              width: '100%'
            },{
              duration: 400,
              easing: variables.easing_swiftOut,
              complete: function(elements) {
                // activate onResize callback for some js plugins
                //$(window).resize();
                // show fullscreen content
                $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                  duration: 400,
                  easing: variables.easing_swiftOut,
                  complete: function(elements) {
                    // activate onResize callback for some js plugins
                    $(window).resize();
                    $rootScope.$apply(function () {
                      $rootScope.redraw = true;
                    })
                  }
                });
                if(mdCardToolbarFixed) {
                  $thisCard.addClass('mdToolbar_fixed')
                }
              }
            });
        }
      }
    }
  }
})();

