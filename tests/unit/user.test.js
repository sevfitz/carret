
const User = require('../../lib/models/user');
const {assert} = require('chai');

describe('User model', () => {

    it('new user generates hash and passes validation with required fields', () => {
        const user = new User({
            name: 'test user',
            email: 'test@test.com',
            role: 'admin'
        });
        const password = 'abc';

        user.generateHash(password);

        assert.notEqual(user.hash, password);
        assert.isOk(user.comparePassword('abc'));
        assert.isNotOk(user.comparePassword('bad password'));
    });

    it('fails validation missing required fields', () => {
        const user = new User();

        return user.validate()
            .then(
                () => { throw new Error ('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.name);
                }
            );
    });

    it('fails validation with incorrect field type', () => {
        const user = new User({
            name: {},
            email: {},
            role: {},
            password: {}
        });
        return user.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.name);
                }
            );
    });
});
