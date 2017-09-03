const Router = require('express').Router;
const router = Router();
const User = require('../models/user');

router
    .get('/users', (req, res, next) => {
        User.find({ role: 'user' })
            .lean()
            .select('name email role status')
            .select('-_id')
            .then(users => res.send(users))
            .catch(next);
    })

    .get('/users/:email', (req, res, next) => {
        User.findOne({ email: req.params.email })
            .lean()
            .select('name email role status')
            .select('-_id')
            .then(user => res.send(user))
            .catch(next);
    })
    
    .patch('/users/:email', (req, res, next) => {
        User.findOneAndUpdate(
            { email: req.params.email },
            { $set: req.body },
            { new: true, runValidators: true }
        )
            .lean()
            .select('name email role status')
            .select('-_id')
            .then(user => res.send(user))
            .catch(next);
    })

    .delete('/users/:email', (req, res, next) => {
        User.remove({ email: req.params.email })
            .then(result => res.send({ removed: !!result }))
            .catch(next);
    });

module.exports = router;
