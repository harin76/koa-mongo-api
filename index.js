
"use strict";
let config = require('./config');

(function() {
    let app = require('./app');
    module.exports = app.listen(config.app.port);
})();
