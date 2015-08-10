"use strict";


let koa = require('koa'),
    mongo = require('koa-mongo'),
    cors = require('koa-cors'),
    authlib = require('./lib/authlib'),
    mountHelper = require('./lib/mount-helper'),
    config = require('./config'),
    services = require('./services'),
    morgan = require('koa-morgan');


let app = koa();

app.use(morgan.middleware('combined', {}));
app.use(cors({
    headers:['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(authlib.auth);
app.use(mongo({
    host: config.mongo.host,
    max: 5,
    min: 1,
    timeout: 30000,
    logout: false
}));

app.use(mountHelper.mount('/api/v1', services.v1));

module.exports = app;