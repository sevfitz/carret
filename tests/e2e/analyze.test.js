const db = require('./helpers/db');
const { assert } = require('chai');
const analyze = require('../../lib/utils/analyze');
const failedLogins = require('../../lib/utils/failed-logins');

const good = {
    email: 'frombypdx@live.com',
    ip: '65.154.20.170'
};

const bad = {
    email: 'test@test.com',
    ip: '188.166.218.212'
};

const blacklisted = {
    email: 'reallybad@theworst.com',
    ip: '192.168.200.99'
};

let blacklistedIp = null;
let blacklistedEmail = null;

let badIp =  {
    ip: '192.168.200.99',
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
};

let badEmail = {
    email: 'reallybad@theworst.com',
    risk_score: 80,
    is_known_attacker: false,
    high_risk_security_events_count: 0,
    security_events_count: 0,
    is_disposable: true,
    is_email_malformed: false,
    is_email_harmful: false
};

function emailBlacklist(emailObject) {
    return failedLogins.addToEmailBlacklist(emailObject)
        .then(result => {
            blacklistedEmail = result;
            return blacklistedEmail;
        });
}

function ipBlacklist(ipObject) {
    return failedLogins.addToIpBlacklist(ipObject)
        .then(result => {
            blacklistedIp = result;
            return blacklistedIp;
        });
}

describe('analyze', function () {
    this.timeout(5000);

    before(db.drop);
    before(() => emailBlacklist(badEmail));
    before(() => ipBlacklist(badIp));

    it('returns validated for good sqreen email and ip address', () => {
        return analyze.verifyUser(good.email, good.ip)
            .then(res => {
                assert.equal(res, 'validated');
            });
    });

    it('returns terminate for good sqreen email and bad ip address', () => {
        return analyze.verifyUser(good.email, bad.ip)
            .then(res => {
                assert.equal(res, 'terminate');
            });
    });

    it('returns terminate for bad sqreen email and good ip address', () => {
        return analyze.verifyUser(bad.email, good.ip)
            .then(res => {
                assert.equal(res, 'terminate');
            });
    });

    it('returns terminate for bad sqreen email and bad ip address', () => {
        return analyze.verifyUser(bad.email, bad.ip)
            .then(res => {
                assert.equal(res, 'terminate');
            });
    });

    it('returns terminate for blacklisted email and non-blacklisted ip address', () => {
        return analyze.verifyUser(blacklisted.email, good.ip)
            .then(res => {
                assert.equal(res, 'terminate');
            });
    });

    it('returns terminate for non-blacklisted email and blacklisted ip address', () => {
        return analyze.verifyUser(good.email, blacklisted.ip)
            .then(res => {
                assert.equal(res, 'terminate');
            });
    });

    it('returns terminate for blacklisted email and blacklisted ip address', () => {
        return analyze.verifyUser(blacklisted.email, blacklisted.ip)
            .then(res => {
                assert.equal(res, 'terminate');
            });
    });
});
