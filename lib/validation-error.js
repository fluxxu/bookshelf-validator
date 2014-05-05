function ValidationError(errors) {
    this.message = 'Model validation error.';
    this.errors = errors;
}
ValidationError.prototype = new Error;
ValidationError.prototype.name = 'ValidationError';
ValidationError.prototype.constructor = ValidationError;

module.exports = ValidationError;