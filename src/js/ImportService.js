/**
 * Angular.js application service
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .factory('$importSerice',[
            function() {
    
                function _import(str) {
                    return angular.isDefined(str) && str.split('-').map(function(c) {
                        return '#' + c;
                    });
                }
    
                return _import;
            }]);