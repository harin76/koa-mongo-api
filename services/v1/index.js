"use strict";
let Router = require('koa-router');

let router = new Router();

require('./users').register(router);

module.exports = router.middleware();