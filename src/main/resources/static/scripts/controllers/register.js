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
        .controller('RegisterCtrl', RegisterCtrl);

    RegisterCtrl.$inject = ['$scope',  '$state', 'toastr', '$location', '$stateParams', '$element', '$http', '$window', 'SeUtil', 'httpService'];

    function RegisterCtrl ($scope, $state, toastr, $location, $stateParams, $element, $http, $window, SeUtil, httpService) {

        var vm = $scope
        var today = new Date()
        vm.month= today.getMonth()+1
        var startOfMonth = moment(today).startOf('month').toDate()
        var endOfMonth = moment(today).endOf('month').toDate()
        var startWeekDay = startOfMonth.getDay()
        var endWeekDay = 6 - endOfMonth.getDay()
        var lastMonthLastDay = moment(today).subtract(1, 'month').endOf('month').toDate()
        var LastMonthDay = lastMonthLastDay.getDate()
        var startDate = moment(LastMonthDay).subtract(lastMonthLastDay, 'days').toDate()
        vm.dateList = []

        httpService.getRegister(function(register){
            vm.register = register
            if(register && register.lastRegister && moment(register.lastRegister).startOf('day').format('YYYY-MM-DD') == moment(new Date()).startOf('day').format('YYYY-MM-DD')){
                
            }else{
                httpService.register(function(r){
                    console.log(r)
                    vm.showModel()
                }, function(err){
                    console.log(err)
                })
            }
        }, function(err){
            console.log(err)
        })

        httpService.getRegisterHistory({
            start: moment(new Date()).startOf('month').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            end: moment(new Date()).endOf('month').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }, function(rhs){
            vm.registerHistory = rhs

            for(var i=0; i<startWeekDay; i++){
                vm.dateList.push({dayString: ''})
            }
            for(var i=startOfMonth; i<=endOfMonth; i=moment(i).add(1,'days').toDate()){
                var record = {dayString: i.getDate(), date: i}
                if(moment(today).format('YYYY-MM-DD') == moment(i).format('YYYY-MM-DD')){
                    record.isToday = true
                }
                var rd = rhs.filter(function(item){
                    return moment(i).startOf('day').format('YYYY-MM-DD') == moment(item.created).startOf('day').format('YYYY-MM-DD')
                })
                if(rd && rd.length > 0){
                    record.isSign = true
                }
                vm.dateList.push(record)
            }
        }, function(err){
            console.log(err)
        })

        vm.showModel = function(){
            $("#signInPop").attr("class", "pop-mask show")
        }

        vm.hideModel = function(){
            $("#signInPop").attr("class", "pop-mask hide")
        }

    }
})();
