const http = require('http');
const app = require('./lib/app');
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const connect = require('./lib/connect');
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/secure';
connect(dbUri);

server.listen(port, () => {
    // eslint-disable-next-line
    console.log('server running on port:', server.address().port);
});
