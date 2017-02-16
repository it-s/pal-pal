/**
 * Angular.js application controller
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .filter('normalizeColorBit', function () {
        return function (number, pattern) {
            pattern = pattern || "000";
            if (isNaN(parseFloat(number)) || !isFinite(number)) return pattern;
            return ("000" + Math.floor(number)).slice(-3);
        };
    })
    .filter('removeSpaces', [function () {
        return function (string) {
            if (!angular.isString(string)) {
                return string;
            }
            return string.replace(/[\s]/g, '');
        };
    }])
    .filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    //Also remove . and , so its gives a cleaner result.
                    if (value.charAt(lastspace - 1) == '.' || value.charAt(lastspace - 1) == ',') {
                        lastspace = lastspace - 1;
                    }
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });