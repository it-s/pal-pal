/**
 * Angular.js application controller
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .controller('HeadCtrl', ['APP_META', '$scope', function(APP_META, $scope){
        $scope.APP_META = APP_META;
    }]);
