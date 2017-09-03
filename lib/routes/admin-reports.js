const Router = require('express').Router;
const router = Router();
const Event = require('../models/event');

router

    .get('/events', (req, res, next) => {
        let query = {};
        if(req.query.email) query.email = req.query.email;
        if(req.query.type) query.type = req.query.type;
        if(req.query.level) query.level = req.query.level;
        if(req.query.client_loc) query.client_loc = req.query.client_loc;
        if(req.query.risk_score) query.risk_score = req.query.risk_score;
        if(req.query.details) query.details = req.query.details;
        if(req.query.user) query.user = req.query.user;

        Event.find(query)
            .select('-_id')
            .select('-__v')
            .select('-updatedAt')
            .select('-user')
            .then(events => res.send(events))
            .catch(next);
    });

module.exports = router;
