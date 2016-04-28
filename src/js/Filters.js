/**
 * Angular.js application controller
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .filter('normalizeColorBit', function() {
            return function(number, pattern) {
            	pattern = pattern || "000";
                if (isNaN(parseFloat(number)) || !isFinite(number)) return pattern;
                return ("000" + Math.floor(number)).slice(-3);
            };
        });