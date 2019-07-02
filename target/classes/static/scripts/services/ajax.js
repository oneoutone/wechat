(function() {
    'use strict';
    angular
        .module('myAjax', [])
        .service('httpService', ['$http', '$localStorage', function ($http, $localStorage) {
            var self = this;
            //var host = 'http://jcservice.nat300.top/api'
            var host = 'http://localhost:3000/api'


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

            self.register = function(success, fail){
                $http({
                    method: 'post',
                    url: host + '/users/register',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getRegister = function(success, fail){
                $http({
                    method: 'get',
                    url: host + '/users/register',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getRegisterHistory = function(data, success, fail){
                $http({
                    method: 'get',
                    url: host + '/users/registerHistory',
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

            self.getCompanyCount = function(data, success, fail){
                $http({
                    method: 'get',
                    url: host + '/companies/count',
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

            self.getCompanyList = function(data, success, fail) {
                $http({
                    method: 'get',
                    url: host + '/companies',
                    headers: {'Content-Type': 'application/json'},
                    params:data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getBuildingList = function(success, fail) {
                $http({
                    method: 'get',
                    url: host + '/building/all',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getAllCompany = function(success, fail) {
                $http({
                    method: 'get',
                    url: host + '/companies/all',
                    headers: {'Content-Type': 'application/json'}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.companyByBuildingId = function(data, success, fail) {
                $http({
                    method: 'get',
                    url: host + '/companies/allByBuildingId',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    params: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.createCompany = function(data, success, fail) {
                $http({
                    method: 'post',
                    url: host + '/companies',
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

            self.updateCompany = function(data, success, fail) {
                $http({
                    method: 'post',
                    url: host + '/companies/update',
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

            self.deleteCompany = function(id, success, fail){
                $http({
                    method: 'delete',
                    url: host + '/companies/'+id,
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log(r)
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log(r)
                    fail(r)
                })
            }

            self.createBuilding = function(data, success, fail) {
                $http({
                    method: 'post',
                    url: host + '/building',
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

            self.updateBuilding = function(data, success, fail) {
                $http({
                    method: 'post',
                    url: host + '/building/update',
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

            self.deleteBuilding = function(id, success, fail){
                $http({
                    method: 'delete',
                    url: host + '/building/'+id,
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log(r)
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log(r)
                    fail(r)
                })
            }

            self.deleteCompanyUser = function(id, success, fail){
                $http({
                    method: 'delete',
                    url: host + '/users/employee/'+id,
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log(r)
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log(r)
                    fail(r)
                })
            }

            self.getCompanyUser = function(companyId, data, success, fail){
                $http({
                    method: 'get',
                    url: host + '/users/company/' + companyId,
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

            self.getCompanyUserCount = function(companyId, success, fail){
                $http({
                    method: 'get',
                    url: host + '/users/company/' + companyId + '/count',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getCompanyById = function(id, success, fail){
                $http({
                    method: 'get',
                    url: host + '/companies/' + id ,
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.upsertEmployee = function(data, success, fail){
                $http({
                    method: 'post',
                    url: host + '/users/upsertEmployee',
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

            self.getAllFeedbackList = function(data, success, fail){
                $http({
                    method: 'get',
                    url: host + '/feedback/allList',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    params: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getAllFeedbackCount = function(data, success, fail){
                $http({
                    method: 'get',
                    url: host + '/feedback/allCount',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    params: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getAllComplainList = function(data, success, fail){
                $http({
                    method: 'get',
                    url: host + '/complain/allList',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    params: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getAllComplainCount = function(data, success, fail){
                $http({
                    method: 'get',
                    url: host + '/complain/allCount',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    params: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.processResult = function(data, success, fail){
                $http({
                    method: 'post',
                    url: host + '/complain/process',
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

            self.getAllLetterList = function(data, success, fail){
                $http({
                    method: 'get',
                    url: host + '/letter/allList',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    params: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getAllLetterCount = function(data, success, fail){
                $http({
                    method: 'get',
                    url: host + '/letter/allCount',
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()},
                    params: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.replyLetter = function(data, success, fail){
                $http({
                    method: 'post',
                    url: host + '/letter/process',
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

            /*
            meetingRoom CURE
             */
            //get all meeting room list
            self.getMeetingRoomList = function(success, fail){
                $http({
                    method: 'get',
                    url: host + '/meetingRooms',
                    headers: {'Content-Type': 'application/json'}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getMeetingRoomListByBuildingId = function(data, success, fail){
                $http({
                    method: 'get',
                    url: host + '/meetingRooms/meetingsByBuildingId',
                    headers: {'Content-Type': 'application/json'},
                    params: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getMeetingRoomByBuildingId = function(data, success, fail){
                $http({
                    method: 'get',
                    url: host + '/meetingRooms/roomsByBuilding',
                    headers: {'Content-Type': 'application/json'},
                    params: data
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            //meetingRoom create and update method
            self.upsertMeetingRoom = function(data, success, fail){
                $http({
                    method: 'post',
                    url: host + '/meetingRooms',
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

            //meetingRoom delete method
            self.deleteMeetingRoom = function(id, success, fail){
                $http({
                    method: 'delete',
                    url: host + '/meetingRooms/'+id,
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log(r)
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log(r)
                    fail(r)
                })
            }

            self.getMeetingById = function(id, success, fail){
                $http({
                    method: 'get',
                    url: host + '/meetings/'+id,
                    headers: {'Content-Type': 'application/json'}
                }).success(function (r, header, config, status) {
                    console.log(r)
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log(r)
                    fail(r)
                })
            }

            /**
             * meeting CURE
             */
            //meetingRoom create and update method
            self.upsertMeeting = function(data, success, fail){
                $http({
                    method: 'post',
                    url: host + '/meetings',
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

            self.getMeeting = function(param, success, fail){
                $http({
                    method: 'get',
                    url: host + '/meetings',
                    headers: {'Content-Type': 'application/json'},
                    params: param
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.getMeetingByBuildingId = function(param, success, fail){
                $http({
                    method: 'get',
                    url: host + '/meetings/meetingsByBuildingId',
                    headers: {'Content-Type': 'application/json'},
                    params: param
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.checkToken = function(token, success, fail){
                $http({
                    method: 'post',
                    url: host + '/users/checkToken',
                    headers: {'Content-Type': 'application/json'},
                    data: {accessToken: token}
                }).success(function (r, header, config, status) {
                    console.log("success")
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log("fail")
                    fail(r)
                })
            }

            self.deleteMeeting = function(id, success, fail){
                $http({
                    method: 'delete',
                    url: host + '/meetings/'+id,
                    headers: {'Content-Type': 'application/json', 'Authorization': getAccessToken()}
                }).success(function (r, header, config, status) {
                    console.log(r)
                    success(r)
                }).error(function (r, header, config, status) {
                    console.log(r)
                    fail(r)
                })
            }

            function getAccessToken() {
                console.log('getAccessToken')
                if (!self.accessToken) {
                    self.accessToken = $localStorage["local-setting"].accessToken
                }
                return self.accessToken
            }
        }])
})();
