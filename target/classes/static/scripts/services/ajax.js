(function() {
    'use strict';
    angular
        .module('myAjax', [])
        .service('httpService', ['$http', '$localStorage', function ($http, $localStorage) {
            var self = this;
            var host = 'http://localhost:8080/api'

            self.print1 = function () {
                console.log('print')
            }
            self.ao = 1

            self.wechatAuth = function(data, success, fail){
                $http({
                    method: 'post',
                    url: host + '/users/wechatAuth',
                    headers: {'Content-Type': 'application/json'},
                    data:data
                }).success(function (r, header, config, status) {
                    success(r)
                }).error(function (r, header, config, status) {
                    fail(r)
                    console.info(r);
                })
            }

            self.getProfile = function (id, success, fail) {
                $http({
                    method: 'get',
                    url: host + '/users/managers/'+id+'/profile',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log(r)
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log(r)
                    fail(r)
                })
            }

            self.getMyProfile = function (success, fail) {
                $http({
                    method: 'get',
                    url: host + '/users/profile',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r) {
                    console.log(r)
                    success(r)
                }).error(function (r) {
                    console.log(r)
                    fail(r)
                })
            }

            self.getManagers = function(success, fail){
                $http({
                    method: 'get',
                    url: host + '/users/managers/list',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log(r)
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log(r)
                    fail(r)
                })
            }

            self.upsertManager = function(data, success, fail){
                $http({
                    method: 'post',
                    url: host + '/users/managers/upsert',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    data: data
                }).success(function (r, header, config, status) {
                    console.log(r)
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log(r)
                    fail(r)
                })
            }

            self.deleteManager = function(id, success, fail){
                $http({
                    method: 'delete',
                    url: host + '/users/managers/'+id,
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log(r)
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log(r)
                    fail(r)
                })
            }

            self.signin = function (data, success, fail) {
                $http({
                    method: 'post',
                    url: host + '/users/signin',
                    headers: {'Content-Type': 'application/json'},
                    data: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.createProduct = function(data, success, fail) {
                $http({
                    method: 'post',
                    url: host + '/products',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    data: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getProductList = function(data, success, fail) {
                $http({
                    method: 'get',
                    url: host + '/products',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    params:data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getRedeemCount = function(data, success, fail) {
                $http({
                    method: 'get',
                    url: host + '/products/redeem/count',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    params:data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getRedeems = function(data, success, fail) {
                $http({
                    method: 'get',
                    url: host + '/products/redeem/list',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    params:data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getAllRedeems = function(data, success, fail) {
                $http({
                    method: 'get',
                    url: host + '/products/redeem/all',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    params:data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getRedeem = function(id, success, fail) {
                $http({
                    method: 'get',
                    url: host + '/products/redeem/'+id,
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getClientProductList = function(success, fail) {
                $http({
                    method: 'get',
                    url: host + '/products/clientList',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getProductCount = function(data, success, fail) {
                $http({
                    method: 'get',
                    url: host + '/products/count',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    params:data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getProduct = function(id, success, fail) {
                $http({
                    method: 'get',
                    url: host + '/products/'+id,
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getRedeemList = function(success, fail) {
                $http({
                    method: 'get',
                    url: host + '/products/redeemList',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getScoreList = function(success, fail) {
                $http({
                    method: 'get',
                    url: host + '/products/scoreList',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getSign = function(success, fail){
                $http({
                    method: 'get',
                    url: "https://zc.salty-egg.com/api/utils/ossSign",
                    headers: {'Content-Type': 'application/json'}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.sendAuthCode = function(data, success, fail){
                console.log(data)
                $http({
                    method: 'post',
                    url: host + '/util/sendAuthCode',
                    headers: {'Content-Type': 'application/json'},
                    data: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.wechatOpenId = function(data, success, fail) {
                $http({
                    method: 'post',
                    url: host + '/users/wechatOpenId',
                    headers: {'Content-Type': 'application/json'},
                    data: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.wechatBind = function(data, success, fail){
                $http({
                    method: 'post',
                    url: host + '/users/wechatBind',
                    headers: {'Content-Type': 'application/json'},
                    data: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.batchUpdateProduct = function(data, success, fail){
                $http({
                    method: 'post',
                    url: host + '/products/batchUpdate',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    data: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.redeem = function(data, success, fail){
                $http({
                    method: 'post',
                    url: host + '/products/redeem',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    data: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.orgList = function(success, fail){
                $http({
                    method: 'get',
                    url: host + '/organizations/list',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            function getAccessToken() {
                if (!self.accessToken) {
                    self.accessToken = $localStorage["local-setting"].accessToken
                }
                return self.accessToken
            }
        }])
})();
