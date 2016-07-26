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
                svg_tag = "<svg width=\"%s\" height=\"48\" xmlns=\"http://www.w3.org/2000/svg\">",
                svg_background = "<rect width=\"%s\" x=\"0\" y=\"0\" height=\"48\" fill=\"#fff\" />",
                svg_swatch = "<rect width=\"24\" height=\"24\" x=\"%s\" y=\"8\" fill=\"%s\" />",
                svg_text = "<text x=\"5\" y=\"44\" font-family=\"sans\" font-size=\"4\">%s</text>";


            function _parse(str, args) {
                var i = 0;
                return str.replace(/%s/g, function() {
                    return args[i++] || '';
                });
            }

            function _name(pal) {
                return pal.join("-").replace(/#/g, "");
            }

            function _file(data, name, mime_type) {
                var blob = new Blob([data], {type: mime_type});
                return {
                    filename: name,
                    get: function() {
                        var dlink = document.createElement('a');
                        dlink.download = name;
                        dlink.href = window.URL.createObjectURL(blob);
                        dlink.onclick = function(e) {
                            // revokeObjectURL needs a delay to work properly
                            var that = this;
                            setTimeout(function() {
                                window.URL.revokeObjectURL(that.href);
                            }, 1500);
                        };

                        dlink.click();
                        dlink.remove();
                    }
                };
            }

            function _link(pal) {
                return $location.absUrl().split('#')[0] + "#/" + name;
            }

            function _svg(pal) {
                var length = pal.length,
                    width = 48 + 24 * length,
                    svg = _parse(svg_tag, [width]);
                svg += _parse(svg_background, [width]);
                svg += pal.map(function(item, index) {
                    var rgb = $colorSerice(item).toRgb();
                    return _parse(svg_swatch, [(24 + index * 24), item]);
                }).join("");
                svg += _parse(svg_text, [_link(pal)]);
                svg += "</svg>";
                return _file(svg, name + ".svg", 'image/svg+xml');
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
                return _file(gimp, name + ".gpl", 'text/plain');
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
