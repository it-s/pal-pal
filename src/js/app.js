/**
 * Angular.js application configuration
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app', [
  'ngRoute',
  'com.likalo.ui'
])
 .constant('APP_META', {
     title: 'pal-pal',
     description: 'A simple palette management tool.',
     icon: 'palette'
 })
 .config([
    '$routeProvider',
    '$locationProvider',
    function($routeProvider, $locationProvider){
        
      /*
       * Setting up router
       */
      $routeProvider
        .when('/:sequence?', {
          templateUrl: 'templates/page.home.html',
          controller: 'HomeCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });

      /*
       * Disable HTML5 aws it conflicts with SVG specs
      */
      $locationProvider
        .html5Mode(false);
     
 }]);
