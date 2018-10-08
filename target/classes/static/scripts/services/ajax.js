(function() {
    'use strict';
    angular
        .module('myAjax', [])
        .service('httpService', ['$http', '$localStorage', function ($http, $localStorage) {
            var self = this;
            var host = 'http://localhost:8080'

            self.print1 = function () {
                console.log('print')
            }
            self.ao = 1
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

            function getAccessToken() {
                if (!self.accessToken) {
                    console.log('svvvv')
                    console.log( $localStorage["锦创科技-Setting"])
                    self.accessToken = $localStorage["锦创科技-Setting"].accessToken
                }
                return self.accessToken
            }
        }])
})();
