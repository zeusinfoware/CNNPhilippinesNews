// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngSanitize','ionicLazyLoad'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(['$httpProvider', function ($httpProvider) {
        // ...

        // delete header from client:
        // http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])

.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://dyrjr5ai7818a.cloudfront.net/**','http://www.youtube.com/**'
  ])
})

.directive('peeyLevelIonSlides', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch (
                function () {
                    var activeSlideElement = angular.element(element[0].getElementsByClassName("my-wrap-class"));
                    //constantly remove max height from current element to allow it to expand if required
                    activeSlideElement.css("max-height","0");
                    //if activeSlideElement[0] is undefined, it means that it probably hasn't loaded yet
                    return angular.isDefined(activeSlideElement[0])? activeSlideElement[0].offsetHeight : 500 ;
                },
                function (newHeight, oldHeight) {
                  console.log(element[0].getElementsByClassName("my-wrap-class"));
                  
                    var sildeElements = angular.element(element[0].getElementsByClassName("my-wrap-class"));
                    sildeElements.css("max-height",newHeight+"px");
                }
            );
        }
    }
})


.config(function($ionicConfigProvider) {
$ionicConfigProvider.tabs.position('bottom');
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    

    .state('menu', {
    url: '/menu',
    abstract: true,
    templateUrl: 'templates/menus.html',
    controller: 'NewsCtrl'
  })

      // Each tab has its own nav history stack:

  .state('menu.news', {
      url: '/news',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-topnews.html',
          controller: 'NewsCtrl'
        }
      }
    })


  .state('menu.topics', {
      url: '/topics',
      views: {
        'menuContent': {
          templateUrl: 'templates/topic.html',
          controller: 'NewsCtrl'
        }
      }
    })

    .state('menu.newsdetail', {
      url: '/news/:newsItemId',
      views: {
        'menuContent': {
          templateUrl: 'templates/news-detail.html',
          controller: 'NewsDetailCtrl'
        }
      }
    })

    .state('menu.newsvideo', {
      url: '/news/:newsItemId',
      views: {
        'menuContent': {
          templateUrl: 'templates/news-video.html',
          controller: 'NewsDetailCtrl'
        }
      }
    })

    .state('menu.youtubevideo', {
      url: '/news/:newsItemId',
      views: {
        'menuContent': {
          templateUrl: 'templates/youtubevideo.html',
          controller: 'NewsDetailCtrl'
        }
      }
    })

    .state('menu.vimeovideo', {
      url: '/news/:newsItemId',
      views: {
        'menuContent': {
          templateUrl: 'templates/vimeovideo.html',
          controller: 'NewsDetailCtrl'
        }
      }
    })


    

 
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/menu/news');

});
