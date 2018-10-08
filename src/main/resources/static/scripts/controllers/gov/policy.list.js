(function() {
  angular
    .module('app')
    .controller('PolicyListCtrl', PolicyListCtrl);

  PolicyListCtrl.$inject = ['$scope', 'Policy'];

  function PolicyListCtrl($scope, Policy) {
    $scope.division = {
      "全国":{
        "所有城市":["所有地区"]
      },
      "上海市": {
        "所有城市":["所有地区"],
        "上海市": ["所有地区","杨浦区", "黄浦区"]
      },
      "浙江省": {
        "所有城市":["所有地区"],
        "杭州市": ["所有地区","上城区", "下城区", "江干区", "拱墅区", "西湖区", "滨江区", "萧山区", "余杭区", "桐庐县", "淳安县", "建德市", "富阳市", "临安市"],
        // "宁波市": ["海曙区", "江东区", "江北区", "北仑区", "镇海区", "鄞州区", "象山县", "宁海县", "余姚市", "慈溪市", "奉化市"],
        // "温州市": ["鹿城区", "龙湾区", "瓯海区", "洞头县", "永嘉县", "平阳县", "苍南县", "文成县", "泰顺县", "瑞安市", "乐清市"],
        // "嘉兴市": ["秀城区", "秀洲区", "嘉善县", "海盐县", "海宁市", "平湖市", "桐乡市"],
        // "湖州市": ["吴兴区", "南浔区", "德清县", "长兴县", "安吉县"],
        // "绍兴市": ["越城区", "绍兴县", "新昌县", "诸暨市", "上虞市", "嵊州市"],
        // "金华市": ["婺城区", "金东区", "武义县", "浦江县", "磐安县", "兰溪市", "义乌市", "东阳市", "永康市"],
        // "衢州市": ["柯城区", "衢江区", "常山县", "开化县", "龙游县", "江山市"],
        // "舟山市": ["定海区", "普陀区", "岱山县", "嵊泗县"],
        // "台州市": ["椒江区", "黄岩区", "路桥区", "玉环县", "三门县", "天台县", "仙居县", "温岭市", "临海市"],
        "台州市": ["所有地区","黄岩区"]
        // "丽水市": ["莲都区", "青田县", "缙云县", "遂昌县", "松阳县", "云和县", "庆元县", "景宁畲族自治县", "龙泉市"]
      }
      };
    $scope.address = {
      province: "全国",
      city: "所有城市",
      district: "所有地区"
    };
    $scope.address.province = "全国";

    /**
     * 用户修改地区，进行按地区查询
     *
     * @param type
     */
    $scope.changeAddress = function(type){
      if(type === 'province'){
        $scope.address.city='所有城市';
        $scope.address.district='所有地区'
      }
      if(type === 'city'){
        $scope.address.district='所有地区'
      }
      var filter= {};
      if ($scope.address.province !== '全国') {
        filter["scope.province"] = $scope.address.province;
      }
      if ($scope.address.city !== '所有城市') {
        filter["scope.city"] = $scope.address.city;
      }
      if ($scope.address.district !== '所有地区') {
        filter["scope.district"] = $scope.address.district;
      }

      Policy.find(
        {filter: {where: filter}},
        function (policies){
          $scope.policyList = policies;
          }, function (err) {
          console.error(err)
      });
    };

    Policy.find({}, function (policies) {
      console.log(policies);
      $scope.policyList = policies;
    }, function (err) {
      console.error(err)
    })

  }
})();
