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
                lastResult = null;

            this.validate = function () {
                if (!lastResult || this.hasChanged()) {
                    return lastResult = evalidator.validate(this.attributes);
                }
                return lastResult;
            };

            this.getErrors = function (prop) {
                if (lastResult)
                    return lastResult.getErrors(prop);
                else
                    return [];
            };

            this.on('saving', function () {
                return this.validate()
                    .then(function (result) {
                        if (result.hasError())
                            throw new ValidationError(result.getErrors());
                    });
            });
        }
    });

    Bookshelf.Model = Model;
};