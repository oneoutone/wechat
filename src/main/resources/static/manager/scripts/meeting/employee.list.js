/**
 * Created by harris on 16/8/29.
 */
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
        .controller('EmployeeListCtrl', EmployeeListCtrl);

    EmployeeListCtrl.$inject = ['$scope', '$timeout', 'toastr', '$stateParams', '$state', 'httpService'];

    function EmployeeListCtrl ($scope, $timeout, toastr, $stateParams, $state, httpService) {
        $scope.userList = [];
        $scope.maxSize = 5;

        $scope.companyId = $stateParams.companyId
        if($stateParams.index){
            $scope.index = $stateParams.index
        }else{
            $scope.index = 1
        }

        httpService.getCompanyById($scope.companyId, function(company){
            $scope.company = company
        }, function(err){
            console.log(err)
        })

        function fetchUsers(index) {
            httpService.getCompanyUserCount($scope.companyId, function(result){
                $scope.bigTotalItems = result.count;
                $scope.bigCurrentPage = index ? index : 1
            }, function(err){
                console.log(err)
            })

            httpService.getCompanyUser($scope.companyId, {page: index ? index : 1}, function(result){
                $scope.userList = result.userList
            }, function(err){
                console.log(err)
            })
        }

        fetchUsers($scope.index)

        $scope.pageChanged = function() {
            if($scope.bigCurrentPage == $stateParams.index){
                return
            }
            $state.go("app.employee.list", {index: $scope.bigCurrentPage, companyId: $scope.companyId})

        };

        $scope.setUser = function(user){
            $scope.Form.$setPristine();
            if(!user){
                $scope.user = {nickName: "", phone: "", email: "", position: ""}
            }else{
                $scope.user = user
            }
        };

        $scope.saveUser = function(){
            if(!$('#nameInput').hasClass('ng-valid')){
                toastr.error("请输入姓名");
                $('#nameInput').addClass('ng-dirty');
                $('#nameInput').addClass('ng-invalid');
                return
            }

            if(!$('#phoneInput').hasClass('ng-valid')){
                toastr.error("手机号格式错误,请输入11位数字手机号码");
                $('#phoneInput').addClass('ng-dirty');
                $('#phoneInput').addClass('ng-invalid');
                return
            }

            if(!$('#emailInput').hasClass('ng-valid')){
                toastr.error("邮箱格式不正确");
                $('#emailInput').addClass('ng-dirty');
                $('#emailInput').addClass('ng-invalid');
                return
            }

            $scope.userLoading = true
            if($scope.user.id){
                httpService.upsertEmployee($scope.user, function(user){
                    console.log(user)
                    $scope.user = user
                    fetchUsers($scope.index)
                    $scope.userLoading = false
                    $('#m-edit').modal('hide')
                }, function(err){
                    console.log(err)
                })
            }else{
                $scope.user.companyId = $scope.companyId
               httpService.upsertEmployee($scope.user, function(user){
                   console.log(user)
                   $scope.user = user
                   fetchUsers($scope.index)
                   $scope.userLoading = false
                   $('#m-edit').modal('hide')
               }, function(err){
                   console.log(err)
               })
            }
        };

        $scope.showDeleteModal = function(user){
            $scope.deleteItem = user
        };

        $scope.deleteUser = function(){
            httpService.deleteCompanyUser($scope.deleteItem.id,function(){
                toastr.success("删除成功");
                fetchUsers($stateParams.index) }, function(err){
                console.info(err);
                toastr.error("删除失败")
            })
        };



    }
})();
