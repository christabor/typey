var fonTypey = (function (options) {
    var self;
    var defaults         = {
        api_key: '',
        auto_add: false,
        auto_add_els: null,
        store_history: true,
        debug: false
    };
    var font_data        = null;
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
    var length;

    if(!opts.api_key) {
        // No point in returning a giant object
        // if user doesn't have any API key.
        return;
    }
    return {
        getFontData: function() {
            return font_data;
        },
        generateDropdownTools: function(fonts, load_to_html) {
            var length            = fonts.length;
            var list_html         = self.createFontLoaderHTML(fonts);

            // DOM element construction
            var font_list         = $('<li class="font-list font-dropdown"></li>');
            var font_size_slider  = $('<li class="font-sizes"></li>');
            var slider_controls   = $('<ul class="slider">' + $.map([9, 12, 14, 16, 18, 24, 32, 48, 72, 84, 96, 120], function(num){ return '<li><a href="#">' + num + 'px</a></li>';}).join('') + '</ul>');

            font_size_slider
            .append(slider_controls);

            font_list
            .html(list_html);

            if(load_to_html) {
                dropdowns
                .append(font_list)
                .append(font_size_slider);
            } else {
                return fonts;
            }
        },
        getRandomFontList: function(number) {
            // Returns a random set of font objects
            // from the loaded data.
            var MAX_RANDOM_FONTS = 10;
            var length = 0;
            var fonts = [];
            if(!font_data) throw new Error('Fonts haven\'t been loaded yet.');
            if(number > font_data.length || number > MAX_RANDOM_FONTS) {
                throw new Error('Too many fonts, or font number larger than the number of available fonts. Please choose at most, ' + MAX_RANDOM_FONTS + ' fonts.');
            }
            length = font_data.length;
            for(var i = 0; i <= number; i++) {
                var random_key = ~~(Math.random() * length);
                fonts.push(font_data[random_key]);
            }
            return fonts;
        },
        generateRandomFonts: function(number) {
            var fonts = [];
            length = $('.fonts:first li').length;

            // randomize an array to N selections
            for(var i = 0; i <= number; i++) {
                var random_key = ~~(Math.random() * length);
                fonts.push(random_key);
            }
            return fonts;
        },
        createFontLoaderHTML: function(fonts) {
            var dropdown = [];
            var _items   = $(fonts);
            self         = this;

            // add a parent container
            dropdown.push('<ul>');

            // add the list of fonts
            _items.each(function (key, font) {
                dropdown.push('<li><a href="#" class="font-main">' + fonts[key].family + '</a>' + self.createFontVariants(fonts[key].family, fonts[key].variants) + '</li>');
            });

            // close out the parent container
            dropdown.push('</ul>');
            return dropdown.join('');
        },
        createFontVariants: function(font, variants) {
            var html = '';
            for(var variant in variants) {
                html += '<a href="#" class="variant" data-font-main="'+font+'">' + variants[variant] + '</a>';
            }
            return html;
        },
        loadFonts: function(load_to_html) {
            self = this;
            $.get(url, function (d) {
                obj.fonts = d.items;
                if (obj.fonts) {
                    font_data = obj.fonts;
                    self.generateDropdownTools(obj.fonts, true);
                    self.registerEvents();
                }
            });
        },
        addToHistory: function (font) {
            if(opts.store_history) {
                font_history.prepend('<li>' + font + '</li>');
            }
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
            var code;
            code = selector[0].nodeName.toLowerCase() + ' {\r\n';
            code += 'font-style: ' + selector.css('font-style') + ';\r\n';
            code += 'font-weight: ' + selector.css('font-weight') + ';\r\n';
            code += 'font-family: ' + (selector.css('font-style').split(",") ? selector.css('font-family') : "'" + selector.css('font-style') + "'") + ';\r\n';
            code += '}\r\n';
            return code;
        },
        exportCSS: function() {
            'use strict';
            var font_exports = '';
            self = this;
            $.each(editable, function(k, tag){
                font_exports += self.roundupStyles($(this));
            });
            exported_content.html('');
            exported_content.text(font_exports);
        },
        getTarget: function(el) {
            // Default to current node if no target is specified.
            el = el.closest('[data-typey-editable]');
            if(!el.attr('data-typey-target')) {
                return $(el[0].nodeName);
            }
            return $(el.data('typey-target'));
        },
        registerEvents: function() {
            'use strict';
            self = this;
            random_btn.on('click.random-click', function(e){
                e.preventDefault();
                var rand = self.generateRandomFonts(dropdowns.length);
                $.each(dropdowns, function(k, dropdown_list){
                    var rand_key = Math.floor(Math.random() * rand.length);
                    $(dropdown_list).find('li .font-main').eq(rand[rand_key]).click();
                });
            });
            export_btn.on('click.export-code', function(e) {
                e.preventDefault();
                self.exportCSS();
            });
            dropdowns.on('click.change-size', '.font-sizes a', function(e){
                e.stopImmediatePropagation();
                e.preventDefault();
                var css    = $(this).text();
                var target = $(this)
                .parent()
                .parent()
                .parent()
                .parent();
                target.css('font-size', css);
            });
            dropdowns.on('click', 'li a', function(e){
                e.stopImmediatePropagation();
                e.preventDefault();
                var _this = $(this);
                var name;
                var opts;
                var weight;
                var style;
                var variant;
                var target = self.getTarget($(this));
                // console.log(target);

                dropdowns
                .find('li, li a')
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
    if(opts.auto_add && opts.auto_add_els) {
        opts.auto_add_els
        .prepend('<ul class="fonts" data-typey-font-list></ul>')
        .attr('data-typey-editable', '')
        .addClass('typer fonts');
    }
    this.loadFonts(true);
}
};
});
