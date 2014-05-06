var DbContext = require('./setup'),
    expect = require('chai').expect,
    ValidationError = require('../').ValidationError;

describe('validator', function () {
    before(function () {
        return DbContext.knex.schema.dropTableIfExists('obj')
            .then(function () {
                return DbContext.knex.schema.createTable('obj', function (table) {
                    table.increments('id').primary();
                    table.string('name').notNullable().unique();
                    table.integer('quantity');
                });
            });
    });

    var Obj = DbContext.Model.extend({
        tableName: 'obj',
        validation: {
            'name': [
                { validator: 'notEmpty', message: 'name is required' },
                { validator: 'matches', args: [/^[a-z0-9 ]+$/i], message: 'name format incorrect'},
                function (value, context) {
                    return DbContext.knex('obj').where('name', value).count('* AS count')
                        .then(function (results) {
                            if (results[0].count > 0)
                                context.addError('name already exists');
                        });
                }
            ],
            'quantity': [
                { validator: 'isInt', message: 'quantity must be integer' }
            ]
        }
    });

    it('should fail: empty object', function () {
        return Obj.forge({}).save()
            .then(function () {
                throw new Error('obj should not be saved');
            })
            .catch(ValidationError, function (e) {
                expect(e.errors).to.have.keys(['name', 'quantity']);
                expect(e.errors.name).to.have.length(2);
                expect(e.errors.name).to.deep.equal(['name is required', 'name format incorrect']);
                expect(e.errors.quantity).to.have.length(1);
                expect(e.errors.quantity[0]).to.equal('quantity must be integer');
            });
    });

    it('should fail: name exists', function () {
        return Obj.forge({ name: 'Name', quantity: 1 }).save()
            .then(function () {
                return Obj.forge({ name: 'Name', quantity: 1}).save()
                    .then(function () {
                        throw new Error('obj should not be saved');
                    })
                    .catch(ValidationError, function (e) {
                        expect(e.errors).to.have.keys(['name']);
                        expect(e.errors.name).to.have.length(1);
                        expect(e.errors.name[0]).to.equal('name already exists');
                    });
            });
    });

});