const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    ip: {
        type: String,
        required: true
    },
    risk_score: Number,
    is_known_attacker: Boolean,
    security_events_count: Number,
    high_risk_security_events_count: Number,
    ip_geo: {
        country_code: String,
        city: String,
        longitude: String,
        latitude: String
    },
    is_datacenter: Boolean,
    is_vpn: Boolean,
    is_proxy: Boolean,
    is_private: Boolean,
    is_tor: Boolean,
    event_id: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
}, {
    timestamps: true
});

schema.static('ipExists', function (ip) {
    return this.find(ip)
        .count()
        .then(count => (count > 0));
});

module.exports = mongoose.model('ipBlacklist', schema);
