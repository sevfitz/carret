const db = require('./helpers/db');
const { assert } = require('chai');
const Event = require('../../lib/models/event');

describe('event logging', function() {
    this.timeout(5000);

    let user = {
        name: 'user1',
        email: 'one@user.com',
        password: 'password1',
        role: 'user',
        status: 'active'
    };

    before(db.drop);
    
    before(() => {
        return db.signup(user)
            .then(() => db.signin(user));
    });

    it('saves an event on sign up', () => {

        return Event.findOne({ type: 'signup' })
            .then(event => {
                assert.equal(event.email, user.email);
                assert.equal(event.type, 'signup');
            });
    });

    it('saves an event on sign in', () => {

        return Event.findOne({ type: 'login' })
            .then(event => {
                assert.equal(event.email, user.email);
                assert.equal(event.type, 'login');
            });
    });
});
