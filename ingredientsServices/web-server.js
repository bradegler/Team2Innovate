const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');


const webServerConfig = require('./config/webserver-port.js');
const databaseRoutes = require('./routing/database');


let httpServer;

const initialize = () => {
    return new Promise((resolve, reject) => {
        const app = express();
        httpServer = http.createServer(app);

        app.use(morgan('combined'));
        app.use(express.static('public'));
        app.use(bodyParser.json());
        app.use(cors());

        app.use('/api/database', databaseRoutes);

        httpServer.listen(webServerConfig.port, err => {
            if (err) {
                reject(err);
                return;
            }

            console.log(`Web server listening on localhost:${webServerConfig.port}`);

            resolve();
        });
    });
}

const close = () => {
    return new Promise((resolve, reject) => {
        console.log('Closing');
        httpServer.close((err) => {
            if (err) {
                reject(err);
                console.log('Reject close');
                return;
            }
            console.log('Resolve close');
            resolve();
        });
    });
}

module.exports.close = close;
module.exports.initialize = initialize;