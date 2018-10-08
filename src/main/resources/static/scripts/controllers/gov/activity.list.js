(function() {
  angular
    .module('app')
    .controller('ActivityListCtrl', ActivityListCtrl);

  ActivityListCtrl.$inject = ['$scope', 'Activity', 'User'];

  function ActivityListCtrl($scope, Activity, User) {

    if(User.getCurrentId()){
      User.findById({id: User.getCurrentId()}, function (user, res) {
        $scope.currentUser = user;
        var filter = { order: 'created DESC'};
        if(user.spaceId){
          filter.where = {spaceId: user.spaceId};
          Activity.find({filter:filter}, function(activities){
            $scope.activityList = activities;
          }, function(err){
            console.info(err)
          });
        }else{
          User.prototype$spaces({id: 'me'}, function (spaces) {
            if(spaces.length > 0){
              filter.where = {spaceId: spaces[0].id};
              Activity.find({filter:filter}, function(activities){
                $scope.activityList = activities;
              }, function(err){
                console.info(err)
              });
            }
          })
        }
      })
    }else{
      Activity.find({filter: {where: {public: true}, order: 'created DESC'}}, function(activities){
        $scope.activityList = activities;
      }, function(err){
        console.info(err)
      });
    }
  }
})();
