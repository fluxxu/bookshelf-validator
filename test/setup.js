var Bookshelf = require('bookshelf'),
    Validator = require('../');

var config = {
        client: 'mysql',
        connection: {
            host     : '127.0.0.1',
            user     : 'test',
            password : 'test',
            database : 'bookshelf_validator_test'
        }
    },
    DbContext = Bookshelf.initialize(config);

DbContext.plugin(Validator.plugin);

module.exports = DbContext;