/**
 * Angular.js application service
 *
 * @author eugene.trounev(a)gmail.com
 */

angular.module('app')
    .factory('$exportSerice', [
        '$location',
        '$colorSerice',
        'normalizeColorBitFilter',
        function($location, $colorSerice, normalizeColorBitFilter) {

            var name,
                svg_tag = "<svg height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\">",
                svg_background = "<rect width=\"%s\" height=\"64\" fill=\"#fff\" />",
                svg_swatch = "<rect width=\"24\" height=\"24\" x=\"%s\" y=\"48\" fill=\"%s\" />",
                svg_text = "<text x=\"5\" y=\"50\" font-family=\"sans\" font-size=\"6\">%s</text>";


            function _parse(str, args) {
                var i = 0;
                return str.replace(/%s/g, function() {
                    return args[i++] || '';
                });
            }

            function _name(pal) {
                return pal.join("-").replace(/#/g, "");
            }

            function _file(data, name) {
                return {
                    filename: name,
                    url: URL.createObjectURL(new Blob([data], {
                        type: 'octet/stream'
                    }))
                };
            }

            function _link(pal) {
                return $location.absUrl().split('#')[0] + "#/" + name;
            }

            function _svg(pal) {
                var length = pal.length,
                    svg = svg_tag;
                svg += _parse(svg_background, [(48 + 24 * length)]);
                svg += pal.map(function(item, index) {
                    var rgb = $colorSerice(item).toRgb();
                    return _parse(svg_swatch, [(24 + index * 24), item]);
                }).join("");
                svg += _parse(svg_text, [_link(pal)]);
                svg += "</svg>";
                return _file(svg, name + ".svg");
            }

            function _ps(pal) {
                return "";
            }

            function _gimp(pal) {
                var gimp = "GIMP Palette\nName: pal-pal\nColumns: 3\n";
                gimp += pal.map(function(item) {
                    var rgb = $colorSerice(item).toRgb();
                    return _parse("%s %s %s %s", [rgb.r, rgb.g, rgb.b, item]);
                }).join("\n");
                return _file(gimp, name + ".gpl");
            }

            function _export(pal) {
                name = _name(pal);
                return {
                    string: name,
                    url: _link(pal),
                    json: angular.toJson(pal),
                    gimp: _gimp(pal),
                    ps: _ps(pal),
                    svg: _svg(pal)
                }
            }

            return _export;
        }
    ]);