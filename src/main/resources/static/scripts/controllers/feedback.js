/**
 * Created by lzh on 22/03/2017.
 */

(function() {
  angular
    .module('app')
    .config(function(toastrConfig) {
      angular.extend(toastrConfig, {
        positionClass: 'toast-top-full-width',
        preventOpenDuplicates: true,
        timeOut: 1000
      });
    })
    .controller('FeedbackCtrl', FeedbackCtrl);

  FeedbackCtrl.$inject = ['$scope', '$stateParams', 'Feedback', 'Comment', 'User', 'Util', 'toastr', '$location', '$state'];

  function FeedbackCtrl ($scope, $stateParams, Feedback, Comment, User, Util, toastr, $location, $state) {
    var vm = $scope;
    $scope.user = {};
    $scope.feedback = {};

    User.findById({id: User.getCurrentId(), filter: {include: "team"}}, function (user) {
      $scope.user = user;
      Util.weChatSign({
        operatorId: $stateParams.operatorId,
        debug: false,
        jsApiList: ['chooseImage', 'uploadImage'],
        url: $location.absUrl().split('#')[0]
      }, function (result) {
        console.info("config", result);
        wx.config(result);
      }, function (error){
        console.error(error);
      });
    }, function(err){
      console.info(err)
    });

    if($stateParams.id && $stateParams.id !== 'new'){
      $scope.id = $stateParams.id;
      var start = moment(new Date()).startOf('day').toDate();
      var end = moment(new Date()).endOf('day').toDate();
      Feedback.findById({id: $stateParams.id, filter: {include: [{relation: "comments", scope: {include: "user"}}, {relation: "user", scope: {include: "team"}}]}}, function(feedback){
        $scope.feedback = feedback;
        if($scope.feedback.comments && $scope.feedback.comments.length > 0){
          for(var i=0; i<$scope.feedback.comments.length; i++){
            var cDate = new Date($scope.feedback.comments[i].created);
            if(cDate >= start && cDate <=end){
              $scope.feedback.comments[i].isToday = true
            }
          }
        }
      }, function(err){
        console.info(err)
      })
    }

    $scope.uploadImage = function(){
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          console.info("choose image", res);
          //$scope.localIds = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          setTimeout(function() {
            $('#loadingToast').fadeIn(100);
            wx.uploadImage({
              localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 0, // 默认为1，显示进度提示
              success: function (res1) {
                Util.uploadWechatImage({operatorId: $stateParams.operatorId, mediaId: res1.serverId}, function(re){
                  $('#loadingToast').fadeOut(100);
                  // $scope.$apply(function () {
                  if($scope.feedback.images){
                    $scope.feedback.images.push(re.imageUrl)
                  }else{
                    $scope.feedback.images = [re.imageUrl]
                  }
                  // })
                });

                // $scope.$apply(function () {
                //var imgUrl = "http://file.api.weixin.qq.com/cgi-bin/media/get?access_token="+$scope.token+"&media_id="+res1.serverId

                /*if($scope.feedback.images){
                 $scope.feedback.images.push(imgUrl)
                 }else{
                 $scope.feedback.images = [imgUrl]
                 }*/
                // })
              }
            });
          }, 100)
        }
      });
    };

    $scope.doFeedback = function(){
      var description = $('#descriptionId').val();
      if(!description || description == ""){
        toastr.error("请输入反馈内容");
        return
      }
      if($stateParams.id && $stateParams.id != 'new'){
        var comment = {
          description: description,
          feedbackId: $stateParams.id,
          userId: $scope.user.id
        };
        Comment.create(comment, function(comment){
          comment.user = $scope.feedback.user;
          comment.isToday = true;
          $scope.feedback.comments.push(comment);
          $('#descriptionId').val("");
          // $('#m-success').show()
        }, function(err){
          console.info(err);
          $('#m-fail').show()
        })
      }else{
        var feedback = {
          description: description,
          status: "waiting",
          userId: $scope.user.id,
          spaceId: $scope.user.spaceId,
          images: $scope.feedback.images
        };
        Feedback.create(feedback, function(feedback){
          $('#m-success').show()
        }, function(err){
          console.info(err);
          $('#m-fail').show()
        })
      }
    };

    $scope.quit = function(){
      $('#m-success').hide();
      wx.closeWindow()
    };
    $scope.close = function(){
      $('#m-fail').hide()
    }

  }
})();
