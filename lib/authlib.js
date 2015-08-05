"use strict";

let jwt         = require('jsonwebtoken'),
    Constants   = require('./constants');

/**
* Authorizes an user request based on the JWT token in the Auth header
* 
* @param {function} next a function to yield 
*/
let auth = exports.auth = function *(next) {
    let authHeader, token, elements, scheme;
    authHeader = this.get('Authorization');

    if(authHeader) {
        elements = authHeader.split(' ');

        if(elements.length === 2) {
            scheme = elements[0];

            if (scheme === 'Bearer') {
                token = elements[1];
                try {
                    this.user = jwt.verify(token, Constants.SECRET);
                } catch (err) {
                    // Do nothing here, will be taken care by sunsequent middlewares
                    // TODO log an error
                }
            }
        }
    }
    yield next;
};


/**
* Verifies if an user request is authorized
* 
* @param {function} next a function to yield 
*/
let isAuth = exports.isAuth = function *(next) {
    if(this.user && this.user.id) {
        yield next;
    } else {
        this.throw(401, 'Not Authorized!');
    }
};