const Event = require('../../lib/models/event');
const {assert} = require('chai');

describe('Event model', () => {

    it('new event passes validation with required fields', () => {
        const event = new Event({
            email: 'mrrobot@protonmail.com',
            type: 'blocked login',
            level: 'high'
        });

        assert.equal(event.email, 'mrrobot@protonmail.com');
        assert.equal(event.type, 'blocked login');
        assert.equal(event.level, 'high');
    });

    it('fails validation when missing required fields', () => {
        const event = new Event();

        return event.validate()
            .then(
                () => { throw new Error ('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.email.name);
                    assert.ok(errors.type.name);
                    assert.ok(errors.level.name);
                }
            );
    });

    it('fails validation with incorrect field type', () => {
        const event = new Event({
            email: {},
            type: {},
            level: {}
        });
        return event.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.email.name);
                    assert.ok(errors.type.name);
                    assert.ok(errors.level.name);
                }
            );
    });
});
