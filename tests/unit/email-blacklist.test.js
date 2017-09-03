const assert = require('chai').assert;
const EmailBlacklist = require('../../lib/models/email-blacklist');

describe('email blacklist model', () => {

    it('validates with required fields', () => {

        const validEmail = new EmailBlacklist ({
            email: 'attacker@yopmail.com',
            risk_score: 50,
            is_known_attacker: false,
            high_risk_security_events_count: 0,
            security_events_count: 0,
            is_disposable: true,
            is_email_malformed: false,
            is_email_harmful: false,
            event_id: '598a00ddc1cad74ed1914eba',
        });

        return validEmail.validate();
    });

    it('fails validation when fields are missing', () => {
        
        const badEmail = new EmailBlacklist();

        return badEmail.validate()
            .then(
                () => { throw new Error('Expected validation error but did not get any'); },
                ({ errors }) => {
                    assert.ok(errors.email);
                }
            );
    }); 
});
