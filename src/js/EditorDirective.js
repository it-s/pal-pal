/**
 * Angular.js directive
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .directive('editor', [
        function() {

            return {
                restrict: 'A',
                require: 'ngModel',
                link: function($scope, $element, $attrs, ngModelCtrl) {

                    ngModelCtrl.$formatters.push(function(value) {
                        return value.join(", ");
                    });

                    ngModelCtrl.$parsers.push(function(value) {
                        return value.split(",").map(function(item){return item.replace(/\s+/g, '');});
                    });

                }
            };
        }
    ]);