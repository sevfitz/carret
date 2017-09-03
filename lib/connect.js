const mongoose = require('mongoose');
mongoose.Promise = Promise;

module.exports = function(dbUri) {
    const promise = mongoose.connect(dbUri).then(() => mongoose.connection);

    mongoose.connection.on('connected', () => console.log('Mongoose default connection open on', dbUri));

    mongoose.connection.on('error', error => console.log('Mongoose default connection error:', error));

    mongoose.connection.on('disconnected', () => console.log('Mongoose default connection disconnected'));

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    return promise;
};
