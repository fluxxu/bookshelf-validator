var Bookshelf = require('bookshelf'),
    Validator = require('bookshelf-validator');

var config = {
        client: 'mysql',
        connection: {
            host     : '127.0.0.1',
            user     : 'test',
            password : 'test',
            database : 'bookshelf_validator_test'
        }
    },
    context = Bookshelf.initialize(config);

context.plugin(Validator.plugin);

module.exports = context;