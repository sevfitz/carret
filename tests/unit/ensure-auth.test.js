const assert = require('chai').assert;
const ensureAuth = require('../../lib/auth/ensure-auth')();
const tokenService = require('../../lib/auth/token-service');

describe('ensure auth middleware', () => {

    it('routes to error handler when no token is found in Authorization header', done => {
        const req = {
            get () { return ''; }
        };

        const next = (error) => {
            assert.deepEqual(error, { code: 401, error: 'No Authorization Found' });
            done();
        };

        ensureAuth(req, null, next);
    });

    it('routes to error handler with bad token', done => {
        const req = {
            get() { return 'bad token'; }
        };

        const next = (error) => {
            assert.deepEqual(error, { code: 401, error: 'Authorization Failed' });
            done();
        };

        ensureAuth(req, null, next);
    });

    it('calls next on valid Authorization and sets user properties on request', done => {
        const payload = { _id: '123', role: 'user' };
        tokenService.sign(payload)
            .then(token => {
                const req = {
                    get(header) { return header === 'Authorization' ? token: null; }
                };

                const next = (error) => {
                    assert.notOk(error);
                    assert.equal(req.user.id, payload._id);
                    assert.equal(req.user.role, payload.role);
                    done();
                };

                ensureAuth(req, null, next);
            })
            .catch(done);
    });
});
