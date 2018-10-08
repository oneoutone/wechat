(function() {
  'use strict';
  angular
    .module('app')
    .directive('inertiaScroll', function () {
      return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
          var elem = $element[0];

          var startY, endY, startTime, endTime, startX, endX, sLocationX, sLocationY, endLocationX;
          var speedDecay = 0.02;//速度衰减量
          var lastMoveTime, secondLastMoveTime;//最后次手指停止移动的时间和倒数第二次手指停止移动的时间（测试的时发现有时候最后一次移动时间不准确，故而选用倒数第二次停止移动的时间）
          var stopMoveInterval;//手指停止滑动的时间
          var direction = 0;//0:不滚 1:水平 2: 垂直 滚动方向

          var stopInertiaMove = true;//停止惯性滚动的标识位

          elem.addEventListener('touchstart', function (e) {
            stopInertiaMove = true;//当惯性滑动过程中再次触碰到屏幕的时候应该立即停止惯性滑动
            startY = e.touches[0].pageY;
            startX = e.touches[0].pageX;
            sLocationX = cDiv.scrollLeft;
            sLocationY = cDiv.scrollTop;
            startTime = Date.now();
          });

          elem.addEventListener('touchmove', function (e) {
            console.info('touchmove');
            //有位移就不能点击
            if(direction == 0){
              var nowY = e.touches[0].pageY;
              var nowX = e.touches[0].pageX;
              if(Math.abs(nowX - startX) > Math.abs(nowY - startY)){
                direction = 1;
                $("#cDiv").css("overflow-y","hidden");
              }else{
                direction = 2;
                $("#cDiv").css("overflow-x","hidden");
              }
            }

            if(direction == 1){
              $("#cDiv").scrollTop(sLocationY)

            }

            if(direction == 2){
              $("#cDiv").scrollLeft(sLocationX)
            }

            if($scope.clickable == true){
              $scope.clickable = false
            }
            //这个事件主要用来记录最后一次停止滑动的时间，当停止滑动时间超过一定量就不执行惯性滑动
            secondLastMoveTime = lastMoveTime;
            lastMoveTime = Date.now();
          });

          elem.addEventListener('touchend', function (e) {
            //滚动完之后才能点击

            endY = e.changedTouches[0].pageY;
            endX = e.changedTouches[0].pageX;
            endTime = Date.now();
            if (secondLastMoveTime) {
              stopMoveInterval = endTime - secondLastMoveTime;
            } else {
              stopMoveInterval = endTime - lastMoveTime;
            }

            //计算速度，距离除以时间
            var speed = (endY - startY) / (endTime - startTime);
            var speedAbs = Math.abs(speed);
            var speedX = (endX - startX) / (endTime - startTime);
            var speedXAbs = Math.abs(speedX);
            var distanceX = speedXAbs*speedXAbs*1000;
            var nowLocation = cDiv.scrollLeft;
            endLocationX = 0;
            if(speedX < 0){
              endLocationX = nowLocation + distanceX;
              if(parseInt(endLocationX / ((window.screen.width - 80) / 2)) == parseInt(nowLocation / ((window.screen.width - 80) / 2))){
                if(endLocationX % ((window.screen.width - 80) / 2) != 0) {
                  if (endLocationX % ((window.screen.width - 80) / 2) > ((window.screen.width - 80) / 4)) {
                    endLocationX = parseInt((cDiv.scrollLeft / ((window.screen.width - 80) / 2) + 1)) * (window.screen.width - 80) / 2;
                  } else {
                    endLocationX = parseInt((cDiv.scrollLeft / ((window.screen.width - 80) / 2))) * (window.screen.width - 80) / 2;
                  }
                }
              }else{
                var endLocationX = parseInt((endLocationX / ((window.screen.width - 80) / 2))) * (window.screen.width - 80) / 2;
              }
            }else{
              endLocationX = nowLocation - distanceX;
              if(parseInt(endLocationX / ((window.screen.width - 80) / 2)) == parseInt(nowLocation / ((window.screen.width - 80) / 2))){
                if(endLocationX % ((window.screen.width - 80) / 2) != 0) {
                  if (endLocationX % ((window.screen.width - 80) / 2) > ((window.screen.width - 80) / 4)) {
                    endLocationX = parseInt((cDiv.scrollLeft / ((window.screen.width - 80) / 2) + 1)) * (window.screen.width - 80) / 2;
                  } else {
                    endLocationX = parseInt((cDiv.scrollLeft / ((window.screen.width - 80) / 2))) * (window.screen.width - 80) / 2;
                  }
                }
              }else{
                var endLocationX = parseInt((endLocationX / ((window.screen.width - 80) / 2))+1) * (window.screen.width - 80) / 2;
              }
            }
            endLocationX = endLocationX > $scope.scrollLength ? $scope.scrollLength : endLocationX;
            endLocationX = endLocationX < 0 ? 0 : endLocationX;
            if(endLocationX > nowLocation){
              speedX = -speedXAbs
            }else{
              speedX = speedXAbs
            }
            console.info("endLocationX", endLocationX);


            /**
             * 惯性移动的递归方法
             */
            function inertiaMove() {
              if (speedAbs < 0 || stopInertiaMove) {
                //如果速度绝对值小于0了，则结束惯性滚动
                //滑动完之后才能点击
                direction = 0;
                $("#cDiv").css("overflow-x","auto");
                $("#cDiv").css("overflow-y","auto");
                setTimeout(function(){
                  $scope.clickable = true
                }, 500);
                return;
              }


              //水平滚动
              if(direction == 1){
                //设置每次惯性滑动时间为20毫秒
                var distance = speedXAbs * 20;
                var nowX = cDiv.scrollLeft;
                if (speedX < 0) {
                  var endX = nowX + distance;
                } else {
                  var endX = nowX - distance;
                }

                //if((nowX >= endLocationX && endX <=endLocationX) || (nowX <= endLocationX && endX >=endLocationX)){
                if (speedX < 0 && (nowX <= endLocationX && endX >=endLocationX)) {
                  stopInertiaMove = true;
                  elem.scrollLeft = endLocationX;
                  inertiaMove();
                  return
                }else if(speedX > 0 && (nowX >= endLocationX && endX <= endLocationX)){
                  elem.scrollLeft = endLocationX;
                  stopInertiaMove = true;
                  inertiaMove();
                  return
                }

                //}


                if (speedX < 0) {
                  //如果速度是负数，则是手指向上滑动。继续惯性滚动，则scrollTop的值会增加
                  elem.scrollLeft += distance;
                  //console.log('向上惯性滚动' + distance);
                } else {
                  //如果速度是正数，则是手指向下滑动。继续惯性滚动，则scrollTop的值会减少
                  elem.scrollLeft -= distance;
                  //console.log('向下惯性滚动' + distance);
                }


                //速度衰减
                //speedXAbs -= speedDecay;
                setTimeout(inertiaMove, 10);
              }

              //竖直滚动
              if(direction == 2){

                //设置每次惯性滑动时间为20毫秒
                var distance = speedAbs * 20;


                if (speed < 0) {
                  //如果速度是负数，则是手指向上滑动。继续惯性滚动，则scrollTop的值会增加
                  elem.scrollTop += distance;
                  //console.log('向上惯性滚动' + distance);
                } else {
                  //如果速度是正数，则是手指向下滑动。继续惯性滚动，则scrollTop的值会减少
                  elem.scrollTop -= distance;
                  //console.log('向下惯性滚动' + distance);
                }


                //速度衰减
                speedAbs -= speedDecay;
                setTimeout(inertiaMove, 10);
              }

            }


            if (stopMoveInterval < 100) {
              //手指停止滑动超过0.1秒的就不执行惯性滑动了
              //direction = 0;
              stopInertiaMove = false;
              inertiaMove();
            }else{
              if(direction == 1){
                stopInertiaMove = false;
                inertiaMove();
                return
              }
              stopInertiaMove = true;
              inertiaMove()
            }
          });

        }
      };
    })
})();

