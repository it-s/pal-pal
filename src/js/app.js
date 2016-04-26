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
     icon: 'color-lens'
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
        .when('/', {
          title: 'pal-pal',
          description: 'A simple palette management tool.',
          url: '#/',
          icon: 'color-lens',
          templateUrl: 'templates/page.home.html',
          controller: 'HomeCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });

      $locationProvider
        .html5Mode(false);
     
 }]);
