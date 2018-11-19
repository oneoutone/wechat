
(function() {
    angular
        .module('app')
        .config(function(toastrConfig) {
            angular.extend(toastrConfig, {
                positionClass: 'toast-top-full-width',
                preventOpenDuplicates: true,
                timeOut: 1000,
            });
        })
        .controller('ManagerListCtrl', ManagerListCtrl);

    ManagerListCtrl.$inject = ['$scope', 'toastr', 'httpService'];

    function ManagerListCtrl($scope, toastr, httpService) {

        var vm = $scope

        function fetchManagers(){
            httpService.getManagers(function(data){
                $scope.userList = data;
            }, function(err){
               console.log(err)
            })
        }

        vm.app.ready(function(){
            fetchManagers()
        })

        //
        // $scope.hasPermission = function(item, permission){
        //     if(!item.roles || item.roles.length == 0){
        //         return false
        //     }
        //     for(var i=0; i<item.roles.length; i++){
        //         if((item.roles[i].name == "admin" || item.roles[i].name == "director") && permission != "admin"){
        //             return true
        //         }
        //         if(item.roles[i].name == permission){
        //             return true
        //         }
        //     }
        //     return false
        // };
        //
        // $scope.setUser = function(user){
        //     //$scope.Form.$setPristine();
        //     if(!user){
        //         if($scope.teams && $scope.teams.length>0){
        //             $scope.teamSelect = $scope.teams[0].id
        //         }
        //         $scope.user = {name: "", phone: "", identityNo: "", email: "", position: "", note: ""};
        //     }else{
        //         User.findById({id: user.id, filter: {include: "accessCards"}}, function(result){
        //             $scope.teamSelect = result.teamId;
        //             result.destoryedCards = [];
        //             result.usingCard = {};
        //             for(var j=0; j<result.accessCards.length; j++){
        //                 if(!result.accessCards[j].destroyedDate){
        //                     result.usingCard = result.accessCards[j];
        //                 }else{
        //                     result.destoryedCards.push(result.accessCards[j]);
        //                 }
        //             }
        //             $scope.user = result;
        //         }, function(err){
        //             console.info(err);
        //         })
        //     }
        // };
        //
        // $scope.destoryCard = function(){
        //     $scope.destoryLoading = true;
        //     AccessCard.prototype$updateAttributes({id: $scope.user.usingCard.id}, {destroyedDate: new Date()}, function (card) {
        //         toastr.success("报废成功");
        //         $scope.user.usingCard = {};
        //         $scope.user.destoryedCards.push(card);
        //         $scope.destoryLoading = false;
        //         //fetchUsers();
        //     }, function (err) {
        //         $scope.destoryLoading = false;
        //         toastr.error("更新失败");
        //     });
        // };
        //
        // $scope.saveCard = function(){
        //     if(!$scope.user.usingCard.externalId || $scope.user.usingCard.externalId == ""){
        //         toastr.error("请输入门禁卡号");
        //         return
        //     }
        //     $scope.saveLoading = true;
        //     if($scope.user.usingCard && $scope.user.usingCard.id) {
        //         AccessCard.prototype$updateAttributes({id: $scope.user.usingCard.id}, $scope.user.usingCard, function (card) {
        //             toastr.success("更新成功");
        //             $scope.saveLoading = false;
        //             $('#m-card').modal('hide');
        //             //User.getManagers({id: $scope.app.user.id}, function(users){
        //             User.prototype$getManagers({id: $scope.app.user.id}, function(users){
        //                 $scope.userList = users;
        //             }, function(err){
        //                 console.info(err);
        //             });
        //         }, function (err) {
        //             if(err.status == 423){
        //                 $scope.saveLoading = false;
        //                 toastr.error("更新失败,该卡号已被绑定");
        //             }else{
        //                 toastr.error("更新失败");
        //             }
        //         });
        //     }else{
        //         $scope.user.usingCard.userId = $scope.user.id;
        //         $scope.user.usingCard.spaceId = $scope.app.setting.spaceId;
        //         AccessCard.create($scope.user.usingCard, function(card){
        //             $scope.saveLoading = false;
        //             $('#m-card').modal('hide');
        //             toastr.success("新建成功");
        //             User.prototype$getManagers({id: $scope.app.user.id}, function(users){
        //                 $scope.userList = users;
        //             }, function(err){
        //                 console.info(err);
        //             });
        //         }, function(err){
        //             $scope.saveLoading = false;
        //             if(err.status == 423){
        //                 toastr.error("新建失败,该卡号已被绑定");
        //             }else{
        //                 toastr.error("新建失败");
        //             }
        //         })
        //     }
        // };
        //
        vm.removeUser = function(userId){
            $scope.currentId = userId
        };

        vm.deleteManager = function(){
            httpService.deleteManager(vm.currentId, function(data){
                $('#delete').modal('hide');
                fetchManagers()
            }, function(err){
                $('#delete').modal('hide');
                console.info(err);
            })
        }
    }
})();
