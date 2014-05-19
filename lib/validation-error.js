function ValidationError(errors) {
    this.message = JSON.stringify(errors);
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
}
ValidationError.prototype = new Error;
ValidationError.prototype.name = 'ValidationError';
ValidationError.prototype.constructor = ValidationError;

module.exports = ValidationError;
