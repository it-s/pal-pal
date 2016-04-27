/**
 * Angular.js application configuration
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app', [
  'ngRoute',
  'as.sortable',
  'com.likalo.ui'
])
 .constant('APP_META', {
     title: 'pal-pal',
     description: 'A simple palette management tool.',
     icon: 'palette'
 })
 .constant('APP_API', {
     user: '/api/users'
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

      $locationProvider
        .html5Mode(false);
     
 }]);
