const assert = require('chai').assert;
const sqreen = require('../../lib/utils/sqreen');

describe('sqreen api', function () {
    this.timeout(5000);

    it('screens an email and returns risk assessment with a VALID email address', () => {
        const testEmail = 'christinelaguardia@gmail.com';

        return sqreen.sqreenEmail(testEmail)
            .then(res => {
                assert.equal(res.email, testEmail);
                assert.exists(res.risk_score);
            });
    });

    it('screens an email returns NOT FOUND with an INVALID email address', () => {
        const testEmail = '#';

        return sqreen.sqreenEmail(testEmail)
            .then(() => {
                throw new Error('should have returned an error but did not');
            }, res => {
                assert.equal(res.status, 404);
                assert.equal(res.message, 'Not Found');
            });
    });

    it('screens an ip returns risk assessment with VALID ip address', () => {
        const testIp = '65.154.20.170';

        return sqreen.sqreenIp(testIp)
            .then(res => {
                assert.equal(res.ip, testIp);
                assert.exists(res.risk_score);
            });
    });

    it('screens an ip returns NOT FOUND with an INVALID ip address', () => {
        const testIp = '';

        return sqreen.sqreenIp(testIp)
            .then(() => {
                throw new Error('should have returned an error but did not');
            }, res => {
                assert.equal(res.status, 404);
                assert.equal(res.message, 'Not Found');
            });
    });

    it('screens an ip returns BAD REQUEST with an INVALID ip address', () => {
        const testIp = 'BLAH';

        return sqreen.sqreenIp(testIp)
            .then(() => {
                throw new Error('should have returned an error but did not');
            }, res => {
                assert.equal(res.status, 400);
                assert.equal(res.message, 'Bad Request');
            });
    });
});
