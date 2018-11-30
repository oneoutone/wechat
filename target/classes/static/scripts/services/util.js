/**
 * Created by Joe on 7/26/16.
 */


(function() {
  'use strict';
  angular
    .module('se.util', [])
    .service('SeUtil', SeUtil);

  function SeUtil() {
    var self = this;
    self.isWechatBrowser = isWechatBrowser;
    self.calcFloat = calcFloat;
    self.calcFee = calcFee;

    self.getParams = function (name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    /**
     * 生成一个UUID字符串。
     *
     * @returns {string}
     */
    self.uuid = function() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    };

    /**
     * Get the file name of an file.
     *
     * @param fileName
     * @returns {string|ArrayBuffer|Array|Blob|*|Array.<T>}
     */
    self.getFileNameExtension = function(fileName) {
      return fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
    };


    /**
     * Is wechat browser?
     *
     * @returns {boolean}
     */
    function isWechatBrowser() {
      var ua = window.navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == 'micromessenger';
    }

    function calcFee(fromDate, untilDate, price, count, tax){
      if(!fromDate || !untilDate){
        return {price: calcFloat(0), totalPrice: calcFloat(0), tax: 0}
      }
      if(!price || !count){
        return {price: calcFloat(0), totalPrice: calcFloat(0), tax: 0}
      }
      if(!tax){
        tax = 0
      }
      var pricePerDay = calcFloat(price*12/365);
      if(moment(fromDate).format() == moment(untilDate).format()){
        var priceWithoutTax = calcFloat(pricePerDay*count);
        var tax = calcFloat(priceWithoutTax*tax);
        var totalPrice = priceWithoutTax + tax;
        return {price: calcFloat(priceWithoutTax), totalPrice: calcFloat(totalPrice), tax: tax}
      }

      var monthNum = 0;
      var sd = fromDate;
      var lastMonthEnd = fromDate;
      for(var i = 0; sd < untilDate; i++){
        sd = moment(fromDate).add(i, 'months').subtract(1, 'days').toDate();
        if(sd <= untilDate){
          monthNum = i;
        }
      }
      var wholeMonthPrice = 0;
      var splicePrice = 0;
      if(monthNum > 0){
        wholeMonthPrice += price * monthNum;
        lastMonthEnd = moment(fromDate).add(monthNum, 'months').subtract(1, 'days').toDate()
      }

      if(moment(lastMonthEnd).format() == moment(untilDate).format()){
        var priceWithoutTax = calcFloat(wholeMonthPrice* count);
        var tax = calcFloat(priceWithoutTax*tax);
        var totalPrice = priceWithoutTax + tax;
        return {price: calcFloat(priceWithoutTax), totalPrice: calcFloat(totalPrice), tax: tax}
      }
      if(monthNum == 0){
        var newStart = lastMonthEnd
      }else{
        var newStart = moment(lastMonthEnd).add(1, 'days').toDate()
      }
      var days = moment(untilDate).diff(moment(newStart), 'days')+1;
      splicePrice = days*pricePerDay;
      var priceWithoutTax = calcFloat(wholeMonthPrice + calcFloat(splicePrice))* count ;
      var tax = calcFloat(priceWithoutTax*tax);
      var totalPrice = priceWithoutTax + tax;
      return {price: calcFloat(priceWithoutTax), totalPrice: calcFloat(totalPrice), tax: tax}
    }

    function calcFloat(value){
      return Math.round(value*100)/100
    }

  }

})();
