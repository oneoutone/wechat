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
    .controller('MarketDetailCtrl', MarketDetailCtrl);

  MarketDetailCtrl.$inject = ['$scope','Service', '$stateParams', '$state', 'ServiceApply', 'toastr', 'User'];

  function MarketDetailCtrl ($scope, Service, $stateParams, $state, ServiceApply, toastr, User) {
    $scope.id = $stateParams.id;
    Service.findById({id: $stateParams.id}, function(service){
      $scope.service = service;
      $('#serviceContent').html(service.description)
    }, function(err){
      console.info(err)
    });

    $scope.apply = function () {
      if(User.getCurrentId()){
        $('#loadingToast').fadeIn(100);
        User.findById({id: User.getCurrentId()}, function (user) {
          ServiceApply.create({serviceId: $stateParams.id, userId: user.id, status: "pendding", market: $scope.service.market}, function(apply){
            //toastr.success("申请成功")
            $('#loadingToast').fadeOut(100);
            $('#successToast').fadeIn(100);
            setTimeout(function(){
              $('#successToast').fadeOut(100);
            }, 1000)
          }, function(err){
            //toastr.error("申请失败")
          })
        }, function(err){
          $scope.showModal();
          console.info(err)
        })
      }
    };

  }
})();

