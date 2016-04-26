/**
 * Angular.js application controller
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .controller('PageCtrl', ['APP_META', '$scope', function(APP_META, $scope){
        $scope.APP_META = APP_META;
    }]);
