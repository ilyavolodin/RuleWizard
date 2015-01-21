var RuleWizard = function(selector, rule) {
    this.$el = $("body");
    this.rule = null;
    this.functions = {};
    this.initialize(selector);
    this.setRule(rule);
    this.renderRule(rule);
};

RuleWizard.prototype = {
    initialize: function(selector) {
        if (selector) {
            this.$el = $(selector);
            if (this.$el.length === 0) {
                throw new Error("Could not find target element");
            }
        }
    },
    setRule: function(rule) {
        this.rule = rule;
    },

    renderRule: function(rule) {
        if (rule.sections) {
            for(var i = 0, l = rule.sections.length; i<l; i++) {
                this.render(rule.sections[i]);
            }
        }
    },

    render: function(ruleSection) {
        var segmentTemplates = {
            "selector" : "<div class='segment selector dropdown'><div class='display' data-toggle='dropdown'></div><ul class='values dropdown-menu' role='menu'></ul></div>",
            "text": "<div class='segment text'></div>",
            "textfield": "<div class='segment textfield'><input type='text' /></div>"
        };

        var renderSelector = function(section) {
            var template = $(segmentTemplates.selector);
            template.find('.display').text(section.default ? section.default : section.values[0]);
            for (var i = 0, l = section.values.length; i < l; i++) {
                template.find('.values').append('<li role="presentation"><a role="menuitem" tabindex="-1" href="#">' + section.values[i] + "</a></li>");
            }
            if (section.id) {
                template.attr('id', section.id);
            }

            template.find('.values a').click(function(e) {
                e.preventDefault();
                template.find('.display').text($(this).text());
                if (section.onChange) {
                    this.functions[section.onChange.function].apply(this, section.onChange.params);
                }
            });

            this.$el.append(template);
        };
        var renderText = function(section) {
            var template = $(segmentTemplates.text);
            for (var i = 0, l = section.values.length; i < l; i++) {
                if (typeof section.values[i] === 'object') {
                    template.append('<div class="value" id="' + section.values[i].id + '">' + section.values[i].value + '</div>');
                } else {
                    template.append('<div class="value">' + section.values[i] + '</div>');
                }
            }
            this.$el.append(template);
        };
        var renderTextfield = function(section) {
            this.$el.append(segmentTemplates.textfield);
        };

        switch (ruleSection.type) {
            case "selector":
                renderSelector.call(this, ruleSection);
                break;
            case "text":
                renderText.call(this, ruleSection);
                break;
            case "textfield":
                renderTextfield.call(this, ruleSection);
                break;
        }
    }
};
