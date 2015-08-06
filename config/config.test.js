"use strict";

let config = require('./config.global');

config.env = "test";
config.mongo.dbName = "myAppTest";

module.exports = config;