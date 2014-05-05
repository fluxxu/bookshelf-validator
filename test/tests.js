var context = require('./setup');

describe('validator', function () {
    before(function () {
        return context.knex.dropTableIfExists('obj')
            .then(function () {
                return context.knex.createTable('obj', function (table) {
                    table.increments('id').primary();
                    table.string('name').notNullable().unique();
                    table.integer('quantity');
                });
            });
    });

    var Obj = context.Model.extend({
        tableName: 'obj',
        validation: {
            'name': [

            ]
        }
    });

    it('should fail validation', function () {

    });

});