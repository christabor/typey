var fonTypey = (function (options) {
    var self;
    var defaults         = {
        api_key: '',
        store_history: true,
        debug: false
    };
    var opts             = $.extend(defaults, options);
    var base_url         = 'https://www.googleapis.com/webfonts/v1/webfonts';
    var url              = [base_url, '?key=', opts.api_key].join('');
    var obj              = {};
    var ACTIVE_CSS_CLASS = 'active';
    var random_btn       = $('[data-typey-randomize-fonts]');
    var font_history     = $('[data-typey-font-history]');
    var export_btn       = $('[data-typey-font-exporter]');
    var exported_content = $('[data-typey-font-export]');
    var editable         = $('[data-typey-editable]');
    var dropdowns        = $('[data-typey-font-list]');
    var font_exports;
    var length;

    if(!opts.api_key) {
        // No point in returning a giant object
        // if user doesn't have any API key.
        return;
    }
    return {
        generateRandomFonts: function(number) {
            'use strict';
            var fonts = [];
            length = $('.fonts:first li').length;

            // randomize an array to N selections
            for(var i = 0; i <= number; i++) {
                var random_key = Math.floor(Math.random() * length);
                fonts.push(random_key);
            }
            return fonts;
        },
        registerRandomButton: function() {
            'use strict';
            self = this;

            // register random event
            random_btn.on('click', function(e){
                e.preventDefault();
                var rand = self.generateRandomFonts(dropdowns.length);
                $.each(dropdowns, function(k, dropdown_list){
                    var rand_key = Math.floor(Math.random() * rand.length);
                    $(dropdown_list).find('li .font-main').eq(rand[rand_key]).click();
                });
                return;
            });
            return;
        },
        createFontLoaderHTML: function(items) {
            'use strict';
            var dropdown = [];
            var _items = $(items);
            self = this;
            _items.each(function (key, font) {
                dropdown.push('<li><a href="#" class="font-main">' + items[key].family + '</a>' + self.createVariants(items[key].family, items[key].variants) + '</li>');
            });
            return dropdown.join('');
        },
        createVariants: function(font, variants) {
            'use strict';
            var html = '';
            for(var variant in variants) {
                html += '<a href="#" class="variant" data-font-main="'+font+'">' + variants[variant] + '</a>';
            }
            return html;
        },
        requestFontLibrary: function(load_to_html) {
            'use strict';
            self = this;
            $.get(url, function (d) {
                obj.fonts = d.items;
                if (obj.fonts) {
                    var items = obj.fonts;
                    var length = items.length;
                    if(load_to_html) {
                        $('.fonts').html( self.createFontLoaderHTML(items) );
                        return;
                    } else {
                        console.log(items);
                        return items;
                    }
                }
            });
        },
        addToHistory: function (font) {
            'use strict';
            if(opts.store_history) {
                font_history.prepend('<li>' + font + '</li>');
            }
            return;
        },
        createStyleLink: function(name, weight, is_weight) {
            'use strict';
            var url;
            if(is_weight) {
                url = (name.split(' ').join('+')) + ':' + weight;
            } else {
                url = name.split(' ').join('+');
            }

            // slight timing throttle
            setTimeout(function(){
                return  $('#google-font-style').attr('href', 'http://fonts.googleapis.com/css?family=' + url );
            }, 100);
        },
        roundupStyles: function(selector) {
            'use strict';
            var code = selector[0].tagName.toLowerCase() + ' {\r\n';
            code += 'font-style: ' + selector.css('font-style') + ';\r\n';
            code += 'font-weight: ' + selector.css('font-weight') + ';\r\n';
            code += 'font-family: ' + (selector.css('font-style').split(",") ? selector.css('font-family') : "'" + selector.css('font-style') + "'") + ';\r\n';
            code += '}\r\n';
            return code;
        },
        createExportObject: function() {
            'use strict';
            font_exports  = this.roundupStyles($('h1').eq(0));
            font_exports += this.roundupStyles($('h2').eq(0));
            font_exports += this.roundupStyles($('h3').eq(0));
            font_exports += this.roundupStyles($('h4').eq(0));
            font_exports += this.roundupStyles($('h5').eq(0));
            font_exports += this.roundupStyles($('h6').eq(0));
            font_exports += this.roundupStyles($('blockquote').eq(0));
            exported_content.text(font_exports);
        },
        registerExports: function() {
            'use strict';
            self = this;
            export_btn.on('click', function(e) {
                self.createExportObject();
            });
        },
        registerFontEvents: function() {
            'use strict';
            self = this;
            dropdowns.on('click', 'li a', function(e){
                e.stopImmediatePropagation();
                e.preventDefault();
                var name,
                opts,
                _this = $(this),
                weight,
                style,
                target,
                variant;

                target = $(this).parent().parent().parent();

                dropdowns
                .find('.fonts li, .fonts li a')
                .removeClass(ACTIVE_CSS_CLASS);
                _this.parent().addClass(ACTIVE_CSS_CLASS);
                _this.addClass(ACTIVE_CSS_CLASS);

                if(_this.hasClass('font-main')) {
                    name = _this.text();
                    target.css({
                        "font-family" : name
                    });

                    // add stylesheet to reference new name
                    self.createStyleLink(name, '', false);
                } else {
                    _this.find('.font-main').addClass(ACTIVE_CSS_CLASS);
                    name = _this.data('font-main');
                    variant = _this.text();

                    target.css({
                        'font-family': name
                    });

                    if(/[0-9]+italic|italic/.test(variant)) {

                        // any weight/style combos (200italic, 700, 300italic)
                        opts = variant.split('0');

                        // if only italic or italic + weight combo
                        if(opts.length > 1) {
                            weight = opts[0] + '00';
                            style = opts[2];
                        } else {
                            weight = 'regular';
                            style = opts[0];
                        }
                        target.css({
                            'font-weight': weight,
                            'font-style': style
                        });
                    } else if(/regular/.test(variant)) {

                        // standard `regular`
                        target.css({
                            'font-weight': 'regular',
                            'font-style': 'normal'
                        });
                    } else {

                        // simple weight, no style (300, 200, 100)
                        target.css({
                            'font-weight': variant,
                            'font-style': 'normal'
                        });
                    }

                    // add stylesheet to reference new name
                    self.createStyleLink(name, variant, true);
                }

                // add to history...
                self.addToHistory(name);
                $('.active-font').text(name + " " + (weight || "") + " " + (style || ""));
            });
},
initAllFeatures: function() {
    this.requestFontLibrary(true);
    this.registerRandomButton();
    this.registerFontEvents();
    this.registerExports();
}
};
});
