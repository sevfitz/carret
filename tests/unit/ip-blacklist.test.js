const assert = require('chai').assert;
const IpBlacklist = require('../../lib/models/ip-blacklist');

describe('ip blacklist model', () => {

    it('validates with required fields', () => {

        const validIp = new IpBlacklist ({
            ip: '103.229.126.237',
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
            event_id: '598a00ddc1cad74ed1914eba',
        });

        return validIp.validate();
    });

    it('fails validation when fields are missing', () => {
        
        const badIp = new IpBlacklist();

        return badIp.validate()
            .then(
                () => { throw new Error('Expected validation error but did not get any'); },
                ({ errors }) => {
                    assert.ok(errors.ip);
                }
            );
    }); 
});
