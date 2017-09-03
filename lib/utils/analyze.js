const sqreen = require('./sqreen');
const EmailBlacklist = require('../../lib/models/email-blacklist');
const User = require('../../lib/models/user');
const IpBlacklist = require('../../lib/models/ip-blacklist');
const failedLogins = require('./failed-logins');
const Event = require('../../lib/models/event');
const RISK_SCORE = 80;
const TERMINATE = 'terminate';
const VALIDATED = 'validated';

let blacklistedEmail = null;
let blacklistedIp = null;
let isLockedUser = null;
let emailPayload = null;
let ipPayload = null;

module.exports = {

    verifyUser(email, ip) {

        return Promise.all([
            User.isAcctLocked({ 'email': email })
                .then(isLocked => {
                    isLockedUser = isLocked;
                    return isLockedUser;
                }),

            EmailBlacklist.emailExists({ 'email': email })
                .then(result => {
                    blacklistedEmail = result;
                    return blacklistedEmail;
                }),

            IpBlacklist.ipExists({ 'ip': ip })
                .then(result => {
                    blacklistedIp = result;
                    return blacklistedIp;
                }),

            sqreen.sqreenEmail(email)
                .then(payload => {
                    emailPayload = payload;
                    return emailPayload;
                }),

            sqreen.sqreenIp(ip)
                .then(payload => {
                    ipPayload = payload;
                    return emailPayload;
                })
        ])
            .then(() => {
                if (isLockedUser) return TERMINATE;      
                    
                else if (blacklistedEmail || blacklistedIp) {
                    const event = new Event({
                        email: emailPayload.email,
                        type: 'blocked login',
                        level: 'medium',
                        email_details: emailPayload,
                        ip_details: ipPayload
                    });
                    event.save();
                    if(!blacklistedEmail) failedLogins.addToEmailBlacklist(emailPayload);
                    return TERMINATE;
                }
                else if (emailPayload.risk_score >= RISK_SCORE || ipPayload.risk_score >= RISK_SCORE) {
                    const event = new Event({
                        email: emailPayload.email,
                        type: 'blocked login',
                        level: 'medium',
                        email_details: emailPayload,
                        ip_details: ipPayload 
                    });
                    event.save();
                    if(!blacklistedEmail) failedLogins.addToEmailBlacklist(emailPayload);
                    return TERMINATE;
                }
                else if (emailPayload.risk_score < RISK_SCORE && ipPayload.risk_score < RISK_SCORE) {
                    return VALIDATED;
                }
            });
    }
};
