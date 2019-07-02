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
        .controller('BuildingListCtrl', BuildingListCtrl);

    BuildingListCtrl.$inject = ['$scope', '$timeout', 'toastr', '$stateParams', '$state', 'httpService'];

    function BuildingListCtrl ($scope, $timeout, toastr, $stateParams, $state, httpService) {

        $scope.importLoading = false;
        $scope.building = {}

        function fetchData(index, status) {

            httpService.getBuildingList(function(result){
                $scope.buildings = result;
            }, function(err){
                console.log(err)
            })
        }

        fetchData();

        $scope.showDeleteModal = function (row) {
            $scope.deleteItem = row
            $('#delete').modal('show')
        };

        $scope.deleteCompany = function () {
            httpService.deleteBuilding($scope.deleteItem.id, function(r){
                fetchData()
            }, function(err){
                toastr.error(err);
                toastr.error("删除团队失败");
            })
        };

        $scope.setCompany = function () {
            $scope.building = {};
            $scope.dbForm.$setPristine();
        };

        $scope.createBuilding = function () {
            if (!$scope.building.name) {
                toastr.error('请输入楼宇名称');
                $('#nameInput').addClass('ng-dirty');
                $('#nameInput').addClass('ng-invalid');
                return;
            }

            if( $scope.building.id){
                $scope.loading = true;
                httpService.updateBuilding($scope.building, function(building){
                    console.log(building)
                    $scope.loading = false
                    $('#m-edit').modal('hide')
                    fetchData()
                }, function(err){
                    console.log(err)
                    $scope.loading = false
                })
            }else{
                $scope.loading = true;
                httpService.createBuilding($scope.building, function(building){
                    console.log(building)
                    $scope.loading = false
                    $('#m-edit').modal('hide')
                    fetchData()
                }, function(err){
                    console.log(err)
                    $scope.loading = false
                })
            }

        }

        $scope.showEdit = function(building){
            $scope.building = building
            $('#m-edit').modal('show')
        }

    }

})();
