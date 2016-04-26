/**
 * Angular.js application service
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .factory('$colorSerice', ['$window', function($window){
        return $window["tinycolor"] || {};
    }]);
