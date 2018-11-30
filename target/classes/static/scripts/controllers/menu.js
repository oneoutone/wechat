(function() {
  angular
    .module('app')
    .controller('MenuCtrl', MenuCtrl);

  MenuCtrl.$inject = ['$scope', 'Policy', 'Activity'];

  function MenuCtrl($scope, Policy, Activity) {

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
      <!-- Initialize Swiper -->
      initSwiper()
    });

    function initSwiper(){
      var swiper = new Swiper('#topSlider', {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 10,
        autoplay: 2500,
        autoplayDisableOnInteraction: false,
        loop: true
      });
      var swiper = new Swiper('.list-block .swiper-container', {
        initialSlide: 0,
        slidesPerView: 2.3,
        spaceBetween: 10
      });
      <!--end Initialize Swiper -->

      var topImgHeight = Math.floor(window.screen.width/9*5);
      $('#topSlider .swiper-slide img').css('height',topImgHeight);
      var itemMediaWidth = $('.item-media .swiper-slide').width();
      var listSliderImgHeight = Math.floor(itemMediaWidth/9*5);
      $('.item-media .swiper-slide img').css('height',listSliderImgHeight);
      //alert(topImgHeight);
    }




    $scope.serviceList = [
      {
        name: 'VPN 一年服务',
        logo: '../assets/images/vpn.jpg',
        created: '2016-12-09',
        url: "service.vpn"
      },
      {
        name: '技术服务',
        logo: '../assets/images/technology.jpg',
        created: '2016-12-09',
        url: "service.technology"
      }
    ]

    Policy.find({filter: {order: "created DESC", limit: 5, fields: {logo: true, name: true, id: true, created: true}}}, function(policys){
      $scope.policyList = policys;
      Activity.find({filter: {where: {public: true}, order: "created DESC", limit: 5, fields: {logo: true, name: true, id: true, created: true}}}, function(activities){
        $scope.activityList = activities;
        if(activities.length == 0){
          initSwiper()
        }
      }, function(err){
        console.info(err);
        initSwiper()
      })
    }, function(err){
      console.info(err);
      initSwiper()
    })

  }
})();
