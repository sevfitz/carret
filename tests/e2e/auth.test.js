const db = require('./helpers/db');
const request = require('./helpers/request');
const { assert } = require('chai');

describe('auth', function () {
    this.timeout(5000);

    before(db.drop);

    const goodUser = {
        email: 'gooduser@gmail.com',
        ip: '192.168.1.1',
        password: 'abc',
        name: 'test user',
        role: 'admin',
        status: 'active'
    };

    const goodUser2 = {
        email: 'gooduser2@gmail.com',
        ip: '192.168.1.1',
        password: 'abcdfg',
        name: 'test user2',
        role: 'admin',
        status: 'active'
    };

    const goodUser3 = {
        email: 'gooduser3@gmail.com',
        ip: '192.168.1.1',
        password: 'abceg',
        name: 'test user3',
        role: 'admin',
        status: 'active'
    };

    const goodUser4 = {
        email: 'gooduser4@gmail.com',
        ip: '192.168.1.1',
        password: 'abcedsfg',
        name: 'test user4',
        role: 'admin',
        status: 'active'
    };

    before(() => db.signup(goodUser2));
    before(() => db.signup(goodUser3));
    before(() => db.signup(goodUser4));

    describe('user management', () => {

        const badRequest = (url, data, code, error) =>
            request
                .post(url)
                .send(data)
                .then(
                    () => {
                        throw new Error('status should not be ok');
                    },
                    res => {
                        assert.equal(res.status, code);
                        assert.equal(res.response.body.error, error);
                    }
                );

        it('signup requires email', () =>
            badRequest('/auth/signup', { password: 'abc' }, 400, 'both email and password are required')
        );

        it('signup requires password', () =>
            badRequest('/auth/signup', { email: 'abc' }, 400, 'both email and password are required')
        );

        let token = '';

        it('signup', () => {
            return db.signup(goodUser)
                .then(res => assert.ok(token = res.token));
        });

        it('can\'t use same email', () =>
            badRequest('/auth/signup', goodUser, 400, 'the email provided is already in use')
        );

        it('signin requires email', () =>
            badRequest('/auth/signin', { password: 'abc' }, 400, 'both email and password are required')
        );

        it('signin requires password', () =>
            badRequest('/auth/signin', { email: 'abc' }, 400, 'both email and password are required')
        );

        it('signin with wrong user', () =>
            badRequest('/auth/signin', { email: goodUser2.email, password: goodUser3.password }, 401, 'Invalid Login')
        );

        it('signin with wrong password', () =>
            badRequest('/auth/signin', { email: goodUser2.email, password: 'bad' }, 401, 'Invalid Login')
        );

        it('signin with valid email but wrong password creates failed login event', () => {
            return db.signin({ email: goodUser4.email, password: 'bad' })
                .then(
                    () => { throw new Error('status should not be ok'); },
                    () => {
                        return request
                            .get('/admin/reports/events')
                            .set('Authorization', token)
                            .then(res => {
                                res.body.sort((a,b) => a.createdAt > b.createdAt ? -1 : 1);
                                assert.deepEqual(res.body[0].type, 'failed login');
                            });
                    });
        });

        it('signin', () => {
            return db.signin(goodUser3)
                .then(res => assert.ok(res.token));
        });

        it('token is invalid', () =>
            request
                .get('/auth/verify')
                .set('Authorization', 'bad token')
                .then(
                    () => { throw new Error('success response not expected'); },
                    (res) => { assert.equal(res.status, 401); }
                )
        );

        it('token is valid', () =>
            request
                .get('/auth/verify')
                .set('Authorization', token)
                .then(res => assert.ok(res.body))
        );
    });

    describe('unauthorized', () => {

        it('401 with no token', () => {
            return request
                .get('/auth/verify')
                .then(
                    () => { throw new Error('status should not be 200'); },
                    res => {
                        assert.equal(res.status, 401);
                        assert.equal(res.response.body.error, 'No Authorization Found');
                    }
                );
        });

        it('403 with invalid token', () => {
            return request
                .get('/auth/verify')
                .set('Authorization', 'badtoken')
                .then(
                    () => { throw new Error('status should not be 200'); },
                    res => {
                        assert.equal(res.status, 401);
                        assert.equal(res.response.body.error, 'Authorization Failed');
                    }
                );
        });
    });
});
