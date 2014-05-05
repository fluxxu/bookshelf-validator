module.exports = function(Bookshelf) {
    "use strict";
    var proto  = Bookshelf.Model.prototype;
    var EValidator = require('evalidator');
    var ValidationError = require('./validation-error');

    var Model = Bookshelf.Model.extend({

        // Validation rules
        validation: {},

        constructor: function() {
            proto.constructor.apply(this, arguments);
            var evalidator = new EValidator({
                    'rules': this.validation
                }),
                lastResult = null,
                dirty = true;

            this.validate = function () {
                if (!lastResult || dirty) {
                    dirty = false;
                    return lastResult = evalidator.validate(this);
                }
                return lastResult;
            };

            this.getErrors = function (prop) {
                if (lastResult)
                    return lastResult.getErrors(prop);
                else
                    return [];
            };

            this.on('change', function () {
                dirty = true;
            });

            this.on('saving', function () {
                var result = this.validate();
                if (result.hasError())
                    throw new ValidationError(result.getErrors());
            });
        }
    });

    Bookshelf.Model = Model;
};