/**
 * Created by lzh on 30/03/2017.
 */
(function () {
  angular
    .module('app')
    .controller('MarketListCtrl',MarketListCtrl);

    MarketListCtrl.$inject = ['$scope', 'Service', 'User'];
    function MarketListCtrl($scope, Service, User) {
      console.info('hello');

      $scope.service = {
        city: '全国',
        market: '全部'
      };

      $scope.market = "all";

      $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        var width = $(window).width();
        $('img').height(width*5/18)
        });

      $scope.fetchData = function(){
        var filter = {where: {}};
        if($scope.province && $scope.province != ""){
          filter.where.province = $scope.province
        }
        if($scope.city && $scope.city != ""){
          filter.where.city = $scope.city
        }
        if($scope.district && $scope.district != ""){
          filter.where.district = $scope.district
        }

        if(!$scope.user){
          User.findById({id: User.getCurrentId(), filter: {include: ['team']}}, function (user) {
            $scope.user = user;
            if ($scope.user.spaceId) {
              if($scope.market == "all"){
                filter.where.or = [{spaceId: $scope.user.spaceId}, {market: "open"}]
              }else if($scope.market == "open"){
                filter.where.market = "open"
              }else if($scope.market == "private"){
                filter.where.spaceId = $scope.user.spaceId
              }
              Service.find({filter: filter}, function(ss){
                $scope.services = ss
              }, function(err){
                console.info(err)
              })
            }else{
              User.prototype$spaces({id: User.getCurrentId()}, function(sps){
                var spaceIds = sps.map(function(item){return item.id});
                if($scope.market == "all"){
                  filter.where.or = [{spaceId: {inq: spaceIds}}, {market: "open"}]
                }else if($scope.market == "open"){
                  filter.where.market = "open"
                }else if($scope.market == "private"){
                  filter.where.spaceId = {inq: spaceIds}
                }
                Service.find({filter: filter}, function(ss){
                  $scope.services = ss
                }, function(err){
                  console.info(err)
                })
              }, function(err){
                console.info(err)
              })
            }
          });
        }else{
          if ($scope.user.spaceId) {
            if($scope.market == "all"){
              filter.where.or = [{spaceId: $scope.user.spaceId}, {market: "open"}]
            }else if($scope.market == "open"){
              filter.where.market = "open"
            }else if($scope.market == "private"){
              filter.where.spaceId = $scope.user.spaceId
            }
            Service.find({filter: filter}, function(ss){
              $scope.services = ss
            }, function(err){
              console.info(err)
            })
          }else{
            User.prototype$spaces({id: User.getCurrentId()}, function(sps){
              var spaceIds = sps.map(function(item){return item.id});
              if($scope.market == "all"){
                filter.where.or = [{spaceId: {inq: spaceIds}}, {market: "open"}]
              }else if($scope.market == "open"){
                filter.where.market = "open"
              }else if($scope.market == "private"){
                filter.where.spaceId = {inq: spaceIds}
              }
              Service.find({filter: filter}, function(ss){
                $scope.services = ss
              }, function(err){
                console.info(err)
              })
            }, function(err){
              console.info(err)
            })
          }
        }
      };

      $scope.markets = [
        {
          label: '全部',
          value: 0
        },
        {
          label: '内部市场',
          value: 1
        },
        {
          label: '开放市场',
          value: 2
        }];

      $scope.fetchData();

      $("#city").cityPicker({
        title: "请选择适用地区",
        onClose: function(){
          var address = $("#city").val().split(" ");
          $scope.province = address[0];
          $scope.city = address[1];
          $scope.district = address[2];
          $scope.service.city = address[2];
          $scope.fetchData()
        }
      });
      $("#city").val('北京 北京 海淀区');
      //$("#city").data().picker.value=['北京','北京','海淀区'];

      $("#market").picker({
        title: "请选择市场",
        toolbarCloseText:'确定',
        onClose: function(){
          if($("#market").val() == "全部"){
            $scope.market = "all"
          }else if($("#market").val() == "内部市场"){
            $scope.market = "private"
          }else if($("#market").val() == "开放市场"){
            $scope.market = "open"
          }
          $scope.fetchData()
        },
        cols: [
          {
            textAlign: 'center',
            values: ['全部', '内部市场', '开放市场']
          }
        ]
      });
    }

})();
