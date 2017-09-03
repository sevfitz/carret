const db = require('./helpers/db');
const { assert } = require('chai');
const User = require('../../lib/models/user');
const failedLogins = require('../../lib/utils/failed-logins');
const ipBlacklist = require('../../lib/models/ip-blacklist');
const emailBlacklist = require('../../lib/models/email-blacklist');

describe('failed-logins', function () {
    this.timeout(5000);

    before(db.drop);

    let badUser = null;
    before(() => {
        badUser = new User(
            {
                email: 'bad@bad.com',
                ip: '188.166.218.212',
                name: 'bad user',
                role: 'user',
                status: 'active'
            });
        badUser.generateHash('abc');
        badUser.save();
    });

    it('adds bad ip to ipBlacklist', () => {
        return failedLogins.addToIpBlacklist(
            {
                ip: '8.8.8.8',
                ip_version: 4,
                risk_score: 85,
                is_known_attacker: true,
                security_events_count: 2,
                high_risk_security_events_count: 0,
                ip_geo: {
                    country_code: 'USA',
                    city: null,
                    longitude: -97.8219985961914,
                    latitude: 37.750999450683594
                },
                is_datacenter: true,
                is_vpn: false,
                is_proxy: false,
                is_private: false,
                is_tor: false,
            })
            .then((res) => ipBlacklist.findOne({ ip: res.ip })
                .then(badIp => {
                    assert.equal(badIp.ip, '8.8.8.8');
                }));
    });

    it('adds bad email to emailBlacklist', () => {
        return failedLogins.addToEmailBlacklist(
            {
                email: 'attacker@yopmail.com',
                risk_score: 50,
                is_known_attacker: false,
                high_risk_security_events_count: 0,
                security_events_count: 0,
                is_disposable: true,
                is_email_malformed: false,
                is_email_harmful: false
            })
            .then((res) => emailBlacklist.findOne({ email: res.email })
                .then(badEmail => {
                    assert.equal(badEmail.email, 'attacker@yopmail.com');
                }));
    });

    it('locks existing user account', () => {
        return failedLogins.lockUserAccount({ email: badUser.email })
            .then(() => User.findOne({ email: badUser.email })
                .then(lockedUser => {
                    assert.equal(lockedUser.status, 'locked');
                }));
    });
});
