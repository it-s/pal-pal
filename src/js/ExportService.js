/**
 * Angular.js application service
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .factory('$exportSerice',[
        '$location',     
        '$colorSerice',
        'normalizeColorBitFilter',
            function($location, $colorSerice, normalizeColorBitFilter) {
    
                var gimpTemplate = "GIMP Palette\nName: pal-pal\nColumns: 3\n",
                    svgTemplate = "<svg></svg>";

                function GIMPPalette(pal){
                    var o = pal.map(function(item){return $colorSerice(item).toRgb();});

                }
    
                function _import(str) {
                    return angular.isDefined(str) && str.split('-').map(function(c) {
                        return '#' + c;
                    });
                }
    
                function _export(pal) {
                    return {
                        string: pal.join(", "),
                        url: $location.absUrl().split('#')[0] + "#/" + pal.join("-").replace(/#/g, ""),
                        json: angular.toJson(pal),
                        gimp: "",
                        ps: "",
                        svg: ""
                    }
                }
    
                return {
                    'import': _import,
                    'export': _export
                };
            }]);