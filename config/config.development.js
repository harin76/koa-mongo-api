"use strict";

let config = require('./config.global');

config.env = "development";
config.mongo.dbName = "myApp";

module.exports = config;