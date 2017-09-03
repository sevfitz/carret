const Router = require('express').Router;
const router = Router();
const User = require('../models/user');
const tokenService = require('../auth/token-service');
const ensureAuth = require('../auth/ensure-auth')();
const analyze = require('../utils/analyze');
const Event = require('../models/event');
const failedLogins = require('../utils/failed-logins');

function hasEmailAndPassword(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return next({
            code: 400,
            error: 'both email and password are required'
        });
    }
    next();
}

function checkUser(req, res, next) {
    analyze.verifyUser(req.body.email, req.connection.remoteAddress)
        .then(res => {
            if (res === 'terminate') {
                return next({
                    code: 401,
                    error: 'Access Denied'
                });
            }
            next();
        }, next);
}

function saveEvent(user, reason) {
    const newEvent = new Event({
        email: user.email,
        type: reason,
        user: user._id,
        level: 'low'
    });
    newEvent.save();
}

router
    .get('/verify', ensureAuth, (req, res) => {
        res.send({ valid: true });
    })

    .post('/signup', hasEmailAndPassword, checkUser, (req, res, next) => {
        const { email, password, name, role, status } = req.body;

        delete req.body.password;

        User.exists({ email })
            .then(exists => {
                if (exists) {
                    throw next({
                        code: 400,
                        error: 'the email provided is already in use'
                    });
                }

                let user = new User({ email, name, role, status });
                user.generateHash(password);
                return user.save();
            })
            .then(user => {
                saveEvent(user, 'signup');
                return user;
            })
            .then(user => tokenService.sign(user))
            .then(token => res.send({ token }))
            .catch(next);
    })

    .post('/signin', hasEmailAndPassword, checkUser, (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;

        User.findOne({ email })
            .then(user => {
                if (!user) {
                    throw next({
                        code: 401,
                        error: 'Invalid Login'
                    });
                }
                if(user.status === 'locked') {
                    saveEvent(user, 'blocked login');
                    throw next({
                        code: 401,
                        error: 'Blocked Login'
                    });
                } 
                if (user && !user.comparePassword(password)) {
                    const event = new Event({
                        email: user.email,
                        type: 'failed login',
                        user: user._id,
                        level: 'low'
                    });
                    event.save()
                        .then(event => {
                            Event.checkFailedLogins({ email: `${event.email}` })
                                .then(res => {
                                    if(res[0].tooManyAttempts === true) return failedLogins.lockUserAccount({ email: event.email });
                                });
                        });
                    throw next({
                        code: 401,
                        error: 'Invalid Login'
                    });
                } 
                return user;
            })
            .then(user => {
                saveEvent(user, 'login');
                return tokenService.sign(user);
            })
            .then(token => res.send({ token }))
            .catch(next);
    });

module.exports = router;
