const connection = require('mongoose').connection;
const request = require('./request');
const Event = require('../../../lib/models/event');

module.exports = {
    drop() {
        return connection.dropDatabase();
    },
    getToken(user = { name: 'Test User', email: 'test@test.com', password: 'abc' }) {
        return request.post('/auth/signup')
            .send(user)
            .then(res => res.body.token);
    },
    signup(user) {
        return request.post('/auth/signup')
            .send(user)
            .then(res => res.body);
    },
    signin(user) {
        return request.post('/auth/signin')
            .send(user)
            .then(res => res.body);
    },
    saveEvent(event) {
        const newEvent = new Event(event);
        newEvent.save();
    }
};
