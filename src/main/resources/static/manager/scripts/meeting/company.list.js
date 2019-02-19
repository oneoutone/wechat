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
        .controller('CompanyListCtrl', CompanyListCtrl);

    CompanyListCtrl.$inject = ['$scope', '$timeout', 'toastr', '$stateParams', '$state', 'httpService'];

    function CompanyListCtrl ($scope, $timeout, toastr, $stateParams, $state, httpService) {

        $scope.importLoading = false;
        $scope.company = {}

        function fetchData(index, status) {

            httpService.getCompanyCount({
                status: status
            }, function(result){
                $scope.bigTotalItems = result.count;
                $scope.bigCurrentPage = index ? index : 1
            }, function(err){
                console.log(err)
            })

            httpService.getCompanyList({
                status: status,
                page: index
            }, function(result){
                $scope.companies = result.companyList;
            }, function(err){
                console.log(err)
            })
        }

        if ($stateParams.index) {
            $scope.index = $stateParams.index
        }else{
            $scope.index = 1
        }

        if ($stateParams.status) {
            $scope.status = $stateParams.status
        } else {
            $scope.status = "living"
        }

        $scope.pageChanged = function () {
            if ($scope.bigCurrentPage == $stateParams.index) {
                return
            }
            console.info('Page changed to: ' + $scope.bigCurrentPage);
            $state.go('app.company.list', {
                index: $scope.bigCurrentPage,
                status: $scope.status
            }, {reload: true})
        };

        $scope.maxSize = 5;

        fetchData($scope.index, $scope.status);

        $scope.changeLeft = function (company) {
            var status = 'living'
            if(company.status == 'living'){
                status = 'past'
            }
            httpService.updateCompany({id: company.id, status: status}, function(comp){
                company.status = status
                if(status == 'living'){
                    $('#m-return').modal('show')
                }else{
                    $('#m-remove').modal('show')
                }
                fetchData($scope.index, $scope.status);
            }, function(err){
                console.log(err)
            })
        };

        $scope.setState = function(status){
            if(status == $scope.status){
                return
            }
            $scope.status = status
            $state.go('app.company.list', {
                index: 1,
                status: $scope.status
            }, {reload: true})
        }

        $scope.showDeleteModal = function (row) {
            $scope.deleteItem = row
        };

        $scope.deleteCompany = function () {
            httpService.deleteCompany($scope.deleteItem.id, function(r){
                fetchData($scope.index, $scope.status)
            }, function(err){
                toastr.error(err);
                toastr.error("删除团队失败");
            })
        };

        $scope.setCompany = function () {
            $scope.company = {};
            $scope.dbForm.$setPristine();
        };

        $scope.createCompany = function () {
            if (!$scope.company.name) {
                toastr.error('请输入公司名称');
                $('#nameInput').addClass('ng-dirty');
                $('#nameInput').addClass('ng-invalid');
                return;
            }
            if (!$('#phoneInput').hasClass('ng-valid')) {
                toastr.error('联系人手机号码格式不正确');
                $('#phoneInput').addClass('ng-dirty');
                $('#phoneInput').addClass('ng-invalid');
                return;
            }
            if (!$('#emailInput').hasClass('ng-valid')) {
                toastr.error("邮箱格式错误");
                $('#emailInput').addClass('ng-dirty');
                $('#emailInput').addClass('ng-invalid');
                return
            }

            if( $scope.company.id){
                $scope.loading = true;
                httpService.updateCompany($scope.company, function(company){
                    console.log(company)
                    $scope.loading = false
                    $state.go('app.company.list', {
                        index: $scope.bigCurrentPage,
                        status: $scope.status
                    }, {reload: true})
                }, function(err){
                    console.log(err)
                    $scope.loading = false
                })
            }else{
                $scope.company.status = 'living'
                $scope.loading = true;
                httpService.createCompany($scope.company, function(company){
                    console.log(company)
                    $scope.loading = false
                    $state.go('app.company.list', {
                        index: $scope.bigCurrentPage,
                        status: $scope.status
                    }, {reload: true})
                }, function(err){
                    console.log(err)
                    $scope.loading = false
                })
            }

        }

        $scope.showEdit = function(company){
            $scope.company = company
            $('#m-edit').modal('show')
        }

    }

})();
