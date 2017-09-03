
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    email: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['login', 'logout', 'signup', 'failed login', 'blocked login', 'signup blocked', 'account locked']
    },
    level: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high', 'severe']
    },
    client_loc: {
        long: String,
        lat: String,
        city: String,
        State: String,
        Country: String
    },
    risk_score: Number,
    email_details: Object,
    ip_details: Object,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
{ 
    timestamps: true    
});

schema.static('checkFailedLogins', function(email) {
    return this.aggregate([
        { $match: { 
            type: { $in: ['login', 'failed login'] },
            email: email.email,
        }},
        { $sort: { createdAt: -1 } },
        { $limit: 3 },
        { $group: {
            _id: '$type',
            count: { $sum: 1 }
        }},
        { $project: { _id: 0, tooManyAttempts: { $eq: ['$count', 3] }}}
    ]);
});

module.exports = mongoose.model('Event', schema);
