angular.module('starter.controllers', [])

.controller('MenuCtrl', function($scope,$ionicLoading,$location,scopesFactory) {
  


})

.controller('NewsCtrl', function($scope, newsFactory,$location,scopesFactory,$sce,$ionicLoading,$ionicSlideBoxDelegate,$ionicHistory,$state,$stateParams) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
    /*$scope.$on('$ionicView.afterEnter', function (event, viewData) {
      if(scopesFactory.get("selectedNewsTopic")!=null && scopesFactory.get("selectedNewsTopic") !=undefined)
      {
        scopesFactory.store("selectedNewsTopic",scopesFactory.get("selectedNewsTopic"));
        $scope.getNews(scopesFactory.get("selectedNewsTopic").url); 
        $scope.something= true;
      } 
    });
*/

$scope.stopVideo = function() {

      var iframe = document.getElementsByTagName("iframe");
      if(iframe!=undefined && iframe!=null)
        iframe = document.getElementsByTagName("iframe")[0].contentWindow;

      if(iframe!=undefined && iframe!=null)
        iframe.postMessage('{"event":"command","func":"' + 'stopVideo' +   '","args":""}', '*');
      

      var video = angular.element( document.querySelector( '#videopanel' ) );
      if(video!=undefined && video!=null)
      {
        if(video[0]!=undefined && video[0]!=null)
          video[0].pause();
      }
}

    $scope.$on('$ionicView.beforeLeave', function(e) {
        $scope.stopVideo();
    });


    $scope.$on('TopicChanged', function(e) {
      if(scopesFactory.get("selectedNewsTopic")!=null && scopesFactory.get("selectedNewsTopic") !=undefined)
      {
        scopesFactory.store("selectedNewsTopic",scopesFactory.get("selectedNewsTopic"));
        /*$state.transitionTo($state.current, $stateParams, {
            reload: true,
            inherit: false,
            notify: true
        });*/
        $scope.show();
        $scope.getNews(scopesFactory.get("selectedNewsTopic").url); 

      }  
  });

  $scope.news = {};
  $scope.news.latest = {};
  $scope.news.carousel = {};
  $scope.selectedNewsItem=null;
  $scope.currentIndex = $ionicSlideBoxDelegate.currentIndex; 

  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...',
      duration: 1000
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide(5000);
  };



  $scope.showCarousel=true;
  $scope.menus={};
  getWeather();
  getMenus();

  var selectedUrl ="";

  function getMenus()
  {
    $scope.show();
        newsFactory.getMenus()
            .success(function (menus) {
                $scope.menus = menus;
                $scope.hide();
                if(scopesFactory.get("selectedNewsTopic")==null || scopesFactory.get("selectedNewsTopic") ==undefined)
                {
                  selectedUrl = menus['top-menu'][0].url;
                  console.log(selectedUrl);
                  $scope.getNews(menus['top-menu'][0].url);  
                  scopesFactory.store("selectedNewsTopic",menus['top-menu'][0]);
                }
                else
                {
                  $scope.getNews(scopesFactory.get("selectedNewsTopic").url);   
                }
                
            })
            .error(function (error) {
                $scope.hide();
                $scope.status = 'Unable to load customer data: ' + error.message;
            });

  }

  

   function getWeather() {
        $scope.show();
        newsFactory.getWeather()
            .success(function (weather) {
                $scope.weather = weather.main.temp_max;
                $scope.weathericon = weather.weather[0];
                $scope.hide();
                
            })
            .error(function (error) {
                $scope.hide();
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }

    

    $scope.setSelectedTopic = function(selectedTopic)
    {
      scopesFactory.store("selectedNewsTopic",selectedTopic);
      selectedUrl = selectedTopic.url;
      $scope.$broadcast('TopicChanged', {  });
      
    }


    $scope.getSelectedTopic = function()
    {

      return scopesFactory.get("selectedNewsTopic");
    }

   $scope.getNews = function(url) {
        $scope.show();
        newsFactory.getNews(url)
            .success(function (news) {
              $scope.news.latest = news.latest;
              $scope.news.carousel = news.groups[0].articles;
              $ionicSlideBoxDelegate.update();
                $scope.hide();
            })
            .error(function (error) {
                $scope.hide();
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }
   
     
    $scope.toggleSlide=function()
    {
       if($scope.showCarousel==true)
          $scope.showCarousel=false;
      else
        $scope.showCarousel=true;
    }


    $scope.showDetail = function(selectedNewsItem)
    {
      $scope.show();
      var url = selectedNewsItem.url;
      newsFactory.getNewsDetail(url)
            .success(function (newsItem) {
                scopesFactory.store("selectedNewsItem",newsItem);
                $scope.hide();
                if(selectedNewsItem.articleType=="story")
                  $state.go('menu.newsdetail',{newsItemId:newsItem.id});
                else if(selectedNewsItem.articleType=="videoStreaming")
                  $state.go('menu.newsvideo',{newsItemId:newsItem.id});
                else if(selectedNewsItem.articleType=="youtubeVideo" || selectedNewsItem.articleType=="vimeoVideo")
                  $state.go('menu.youtubevideo',{newsItemId:newsItem.id});
                else if(selectedNewsItem.articleType=="vimeoVideo")
                  $state.go('menu.vimeovideo',{newsItemId:newsItem.id});

            })
            .error(function (error) {
              $scope.hide();
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }

    $scope.html5Entities = function(value) {
    return value.replace(/[\u00A0-\u9999<>\&\'\"]/gim, function(i) {
          return '&#' + i.charCodeAt(0) + ';'
        })
      };

    $scope.getStoryFormat=function(story)
    {
      
       var formatStory =story;
       formatStory = formatStory.replace('&lt;![CDATA[', '');
       formatStory = formatStory.replace(']]&gt;', '');
       return $sce.trustAsHtml(htmlDecode(formatStory));
    }

    $scope.getStoryFormatLimit=function(story,limit)
    {
      
       var formatStory =story;
       formatStory = formatStory.replace('&lt;![CDATA[', '');
       formatStory = formatStory.replace(']]&gt;', '');
       formatStory = htmlDecode(formatStory);
       if(formatStory.length>limit)
       {
        formatStory = formatStory.substring(0,limit) + "....";
       }
       return $sce.trustAsHtml(formatStory);
    }

    $scope.getVideos = function()
    {
      getVideos();
    }

    function htmlDecode(input){
      var e = document.createElement('div');
      e.innerHTML = input;
      return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }


    $scope.newsVideos=[];

    function getVideos() {
        newsFactory.getVideos()
            .success(function (newsVideos) {
                $scope.newsVideos = chunk(newsVideos.NewsItem,2);
                $scope.hide();
                
            })
            .error(function (error) {
                $scope.hide();
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }

    function chunk(arr, size) {
        var newArr = [];
        for (var i=0; i<arr.length; i+=size) {
          newArr.push(arr.slice(i, i+size));
        }
        return newArr;
      }

      $scope.getVideoURL = function(selectedItem)
      {
        if(selectedItem.articleType=="youtubeVideo")
          return "http://www.youtube.com/embed/" + selectedItem.videoCode + "?autoplay=1&enablejsapi=1&controls=0";
        else
          return "http://player.vimeo.com/video/" + selectedItem.videoCode + "?autoplay=1";

      }



  
 
})



.controller('NewsDetailCtrl', function($scope, newsFactory,$location,scopesFactory,$sce,$ionicLoading,$state,$ionicHistory) {
   $scope.selectedNewsItem=null;
   $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    });




    $scope.getNewsItem=function()
    {
       console.log($ionicHistory.viewHistory())
       $scope.selectedNewsItem = scopesFactory.get("selectedNewsItem");
       $scope.hide();
    }

   
     $scope.goBack= function()
    {
      if(scopesFactory.get("selectedNewsTopic")!=null && scopesFactory.get("selectedNewsTopic") !=undefined)
      {
        scopesFactory.store("selectedNewsTopic",scopesFactory.get("selectedNewsTopic"));
      }

      if($ionicHistory.backView()==null)
      {
        $state.go('menu.news');
      }
      else
      {
        $ionicHistory.goBack();
      }
      

    }


    $scope.getStoryFormat=function(story)
    {
      
       var formatStory =story;
       formatStory = formatStory.replace('&lt;![CDATA[', '');
       formatStory = formatStory.replace(']]&gt;', '');
       return $sce.trustAsHtml(htmlDecode(formatStory));
    }

    function htmlDecode(input){
      var e = document.createElement('div');
      e.innerHTML = input;
      return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }


})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
