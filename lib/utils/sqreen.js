const superagent = require('superagent');
require('dotenv').config();
const key = process.env.SQREEN_API_KEY;

module.exports = {
    
    sqreenEmail(emailAddress) {
        return superagent
            .get(`https://api.sqreen.io/v1/emails/${emailAddress}`)
            .set('x-api-key', key)
            .then(res => res.body);
    },

    sqreenIp(ipAddress) {
        return superagent
            .get(`https://api.sqreen.io/v1/ips/${ipAddress}`)
            .set('x-api-key', key)
            .then(res => res.body);
    }
};
