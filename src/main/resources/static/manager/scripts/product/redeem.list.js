(function() {
    'use strict';
    angular
        .module('app')
        .config(function(toastrConfig) {
            angular.extend(toastrConfig,
                {positionClass: 'toast-top-full-width',
                    preventOpenDuplicates: true,
                    timeOut: 2000
                });
        })
        .controller('RedeemListCtrl', RedeemListCtrl);

    RedeemListCtrl.$inject = ['$scope', '$state', '$timeout', 'toastr', 'httpService', '$stateParams'];

    function RedeemListCtrl($scope, $state, $timeout, toastr, httpService, $stateParams){
        var vm = $scope;
        vm.orgList = ['全部']

        vm.fetchData = function(){
            if(vm.filter.start){
                vm.filter.start = moment(vm.filter.start ).format('YYYY-MM-DD HH:mm:ss')
            }
            if(vm.filter.end){
                vm.filter.end = moment(vm.filter.end ).format('YYYY-MM-DD HH:mm:ss')
            }
            httpService.getRedeems(vm.filter, function(data){
                vm.redeemList = data.redeemList
            }, function(err){
                console.log(err)
            })

            httpService.getRedeemCount(vm.filter, function(data){
                vm.bigTotalItems = data.count
                vm.bigCurrentPage = vm.filter.page
            }, function(err){
                console.log(err)
            })
        }

        vm.doFilter = function(){
            $state.go('app.redeem.list', {page: 1, org: vm.filter.org, productName: vm.filter.productName, employeeId: vm.filter.employeeId, start: vm.filter.start, end: vm.filter.end})
        }

        vm.pageChanged = function() {
            if(vm.bigCurrentPage == vm.filter.index){
                return
            }
            $state.go('app.redeem.list', {page: vm.bigCurrentPage, org: vm.filter.org, productName: vm.filter.productName, employeeId: vm.filter.employeeId, start: vm.filter.start, end: vm.filter.end})
        };

        vm.download = function(){
            if(vm.filter.start){
                vm.filter.start = moment(vm.filter.start ).format('YYYY-MM-DD HH:mm:ss')
            }
            if(vm.filter.end){
                vm.filter.end = moment(vm.filter.end ).format('YYYY-MM-DD HH:mm:ss')
            }
            httpService.getRedeems(vm.filter, function(data){
                vm.redeemList = data.redeemList
                var records = [];
                var titles = ["订单编号", "兑换人工号", "联系人", "联系电话", "所属公司", "兑礼名称", "积分", "状态", "兑换时间"];
                records.push(titles)
                for(var i=0; i<vm.redeemList.length; i++){
                    var redeem = vm.redeemList[i]
                    var record = [getContent(redeem.no), getContent(redeem.employeeId), getContent(redeem.userName), getContent(redeem.userPhone), getContent(redeem.userOrg), getContent(redeem.productName), getContent(redeem.price), redeem.status == 'accepted' ? '已兑换' : '已完成', moment(redeem.created).format('YYYY-MM-DD HH:mm:ss')]
                    records.push(record);
                }

                generateFile(records)
            }, function(err){
                console.log(err)
            })
        }

        function Workbook() {
            if(!(this instanceof Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
        }

        function generateFile(redeemList){
            console.log(redeemList)
            var wb = new Workbook();
            var ws = {};

            var style = {
                border: {
                    top: { style: "thin", color: { rgb: "ABABAB" } },
                    bottom: { style: "thin", color: { rgb: "ABABAB" } },
                    left: { style: "thin", color: { rgb: "ABABAB" } },
                    right: { style: "thin", color: { rgb: "ABABAB" } },
                },
                alignment: {
                    horizontal: "center"
                }
            };

            for(var i=0; i<redeemList.length; i++) {
                for(var j=0; j<redeemList[i].length; j++) {
                    var cell_ref= XLSX.utils.encode_cell({c:j, r:i});
                    var cell={v:redeemList[i][j], t: 's'};
                    ws[cell_ref] = cell;
                    cell.s = style;
                }
            }


            ws['!ref'] = XLSX.utils.encode_range({s: {c:0, r:0}, e: {c: 10, r:redeemList.length}});

            /* add worksheet to workbook */
            wb.SheetNames.push("兑换列表");
            wb.Sheets["兑换列表"] = ws;
            var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }

            var fileName = '兑换列表'+ moment(new Date()).format('YYYYMMDD') + '.xlsx';
            saveAs(new Blob([s2ab(wbout)],{type:""}), fileName);
        }

        function getContent(input){
            return input == undefined ? "" : input+''
        }

        vm.app.ready(function(){
            //name&status&saleStatus&start&end
            vm.filter = {}
            httpService.orgList(function(r){
                for(var i=0; i<r.length; i++){
                    var tree = r[i].orgTree.split(',')
                    if(tree.length > 2){
                        vm.orgList.push(tree[1]+','+tree[2])
                    }else{
                        vm.orgList.push(tree[1])
                    }
                }
            }, function(err){
                console.log(err)
            })

            if($stateParams.org){
                vm.filter.org = $stateParams.org
            }else{
                vm.filter.org = '全部'
            }
            if($stateParams.productName){
                vm.filter.productName = $stateParams.productName
            }
            if($stateParams.employeeId){
                vm.filter.employeeId = $stateParams.employeeId
            }
            if($stateParams.start){
                vm.filter.start = new Date($stateParams.start)
            }
            if($stateParams.end){
                vm.filter.end = new Date($stateParams.end)
            }
            if($stateParams.page){
                vm.filter.page = $stateParams.page
            }else{
                vm.filter.page = 1
            }
            vm.fetchData()
        })
    }
})();
