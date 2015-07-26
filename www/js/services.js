var newsApp=angular.module('starter.services', []);
var url = 'http://timesofindia.indiatimes.com/feeds/newsfeed/';

newsApp.service('newsFactory',['$http', function($http) {
  this.news ={};
  return {

    getMenus: function() {
     var menus = $http.get('http://cnnphilippines.com/?service=json&menu=true').
        success(function(data) {
            return data;

        });
      return menus;
    },
    getNews: function(topicURL) {
      news = $http({
            method: 'GET',
            url: topicURL,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).
        success(function(data) {
            return data;

        });
      return news;
    },
    getNewsDetail: function(url) {
      newsItem = $http.get(url).
        success(function(data) {
            return data;

        })
         .error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });

      return newsItem;
    },
    getVideos: function() {
      var videos = $http.get('http://timesofindia.indiatimes.com/feeds/videodefaultfeed/3812890.cms?feedtype=sjson&v=1').
        success(function(data) {
            return data;

        });


      return videos;
    },

    getWeather: function() {
      var weather = $http.get('http://api.openweathermap.org/data/2.5/weather?q=Manila,Philippines&units=metric').
        success(function(data) {
            return data;

        });


      return weather;
    },
   
  };
}]);


newsApp.factory('scopesFactory', function ($rootScope) {
    var mem = {};

    return {
        store: function (key, value) {
            mem[key] = value;
        },
        get: function (key) {
            return mem[key];
        }
    };
});