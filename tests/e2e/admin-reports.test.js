const db = require('./helpers/db');
const request = require('./helpers/request');
const { assert } = require('chai');

describe('admin only reports', function () {
    this.timeout(5000);

    let admin = {
        name: 'Mr. Admin Reporter',
        email: 'runreports@admin.com',
        password: 'passwordz',
        role: 'admin',
        status: 'active'
    };

    let events = [
        { email: 'event1@email.com', type: 'login', level: 'low' },
        { email: 'event2@email.com', type: 'logout', level: 'low' },
        { email: 'event3@email.com', type: 'logout', level: 'low' },
        { email: 'event4@email.com', type: 'signup', level: 'low' },
        { email: 'event5@email.com', type: 'signup', level: 'low' },
        { email: 'event6@email.com', type: 'signup', level: 'low' },
        { email: 'event7@email.com', type: 'failed login', level: 'medium' },
        { email: 'event8@email.com', type: 'failed login', level: 'medium' },
        { email: 'event9@email.com', type: 'failed login', level: 'medium' },
        { email: 'event10@email.com', type: 'blocked login', level: 'high' },
        { email: 'event11@email.com', type: 'blocked login', level: 'high' },
        { email: 'event12@email.com', type: 'signup blocked', level: 'high' },
        { email: 'event13@email.com', type: 'signup blocked', level: 'high' },
        { email: 'event14@email.com', type: 'signup blocked', level: 'high' },
        { email: 'event15@email.com', type: 'account locked', level: 'severe' },
        { email: 'event16@email.com', type: 'account locked', level: 'severe' },
        { email: 'event17@email.com', type: 'account locked', level: 'severe' }
    ];

    before(db.drop);
    before(() => db.signup(admin));
    before(() => Promise.all(events.map(db.saveEvent)));

    it('/admin/reports/events?type gets events for an enum type', () => {
        let adminToken = null;

        return db.signin(admin)
            .then(t => adminToken = t.token)
            .then(() => request
                .get('/admin/reports/events/?type=signup+blocked')
                .set('Authorization', adminToken)
            )
            .then(res => {
                assert.equal(res.body.length, 3);
            });
    });
});
