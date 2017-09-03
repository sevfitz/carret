const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        email: {
            type: String,
            required: true
        },
        risk_score: {
            type: Number,
            required: true
        },
        is_known_attacker: Boolean,
        high_risk_security_events_count: Number,
        security_events_count: Number,
        is_disposable: Boolean,
        is_email_malformed: Boolean,
        is_email_harmful: Boolean,
        event_id: {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        },
    },
    {
        timestamps: true
    });

schema.static('emailExists', function (email) {
    return this.find(email)
        .count()
        .then(count => (count > 0));
});

module.exports = mongoose.model('emailBlacklist', schema);
