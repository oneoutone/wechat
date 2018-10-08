/**
 * Created by Joe on 7/26/16.
 */

(function() {
  'use strict';
  angular
    .module('se.bridge', [])
    .service('SeBridge', SeBridge);

    function SeBridge() {
      var self = this;

      function setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
      }

      self.isWechatBrowser = isWechatBrowser;
      self.isSaobaBrowser = isSaobaBrowser;
      self.log = log;

      self.shareConfig = function(config) {
        var ua = window.navigator.userAgent.toLowerCase();

        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          // in wechat

        } else if (ua.match(/Saoba/i) == 'saoba' && (ua.match(/iOS/i) == 'ios')) {
          setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('wxShareConfig', config)
          })
        } else if (ua.match(/Saoba/i) == 'saoba' && (ua.match(/Android/i) == 'android')) {
          Android.shareConfig(JSON.stringify(config))
        }
      };

      function isWechatBrowser() {
        var ua = window.navigator.userAgent.toLowerCase();
        return ua.match(/MicroMessenger/i) == 'micromessenger';
      }

      function log(msg) {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/Android/i) == 'android') {
          Android.log(msg)
        } else {
          setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('log', msg)
          })
        }
      }

      function isSaobaBrowser() {
        var ua = window.navigator.userAgent.toLowerCase();
        return ua.match(/Saoba/i) == 'saoba';
      }


    }
})();
