const db = require('./helpers/db');
const request = require('./helpers/request');
const { assert } = require('chai');

describe('users api', function () {
    this.timeout(5000);

    const me = {
        name: 'logged in user',
        email: 'me@test.com',
        role: 'user',
        password: 'abc',
        status: 'active'
    };
    let token = null;

    before(db.drop);
    before(() => {
        return db.signup(me)
            .then(t => {
                token = t.token;
            });
    });

    it('GETs user\'s own account info', () => {
        return request.get('/me')
            .set('Authorization', token)
            .then(
                res => {
                    delete me.password;
                    const myInfo = res.body;
                    assert.deepEqual(myInfo, me);
                });
    });

    it('PATCHes user\'s own account info', () => {
        return request.patch('/me')
            .set('Authorization', token)
            .send({ email: 'newemail@email.com' })
            .then(() => request
                .get('/me')
                .set('Authorization', token)
            )
            .then(res => {
                me.email = 'newemail@email.com';
                const patchedMe = res.body;
                assert.deepEqual(patchedMe, me);
            });
    });

    it('DELETEs user\'s own account', () => {
        return request.delete('/me')
            .set('Authorization', token)
            .then(res => assert.deepEqual(res.body, { removed: true }));
    });

    it('Attempt to DELETE user\'s own account fails if not there to delete', () => {
        return request.delete('/me')
            .set('Authorization', token)
            .then(res => assert.deepEqual(res.body, { removed: false }));
    });
});
