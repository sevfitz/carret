const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const schema = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
    hash: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'locked'],
        default: 'active'
    }
});

schema.method('generateHash', function (password) {
    this.hash = bcrypt.hashSync(password, 8);
});

schema.method('comparePassword', function (password) {
    return bcrypt.compareSync(password, this.hash);
});

schema.static('exists', function (query) {
    return this.find(query)
        .count()
        .then(count => (count > 0));
});

schema.static('findUser', function (query) {
    return this.find(query);
});

schema.static('isAcctLocked', function (email) {
    return this.findOne(email)
        .select('status')
        .then(res => {
            res === 'locked' ? true : false;
        });
});

module.exports = mongoose.model('User', schema);
