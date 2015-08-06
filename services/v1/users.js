"use strict";

let parse = require('co-body'),
    db = require('../../db'),
    User = require('../../models/user'),
    authLib = require('../../lib/authLib'),
    Constants = require('../../lib/constants'),
    jwt = require('jsonwebtoken'),
    config = require('../../config');


/**
* A helper to get the collection object
* 
* @param (object) ctx   A context that contains the mongodb instance
*/
let getCollection = function (ctx) {
    return ctx.mongo.db(config.mongo.dbName).collection('users');
};

/**
* Create a user
*/
let createUser = exports.createUser = function *() {
    
    let data = yield parse(this);

    let user = new User(data);
    let result = yield user.create(getCollection(this));

    if(result.errors) {
        this.throw (400, JSON.stringify(result));
    }

    this.body = result.data;
    this.status = 201;
};

/**
* Verify user credentials
*/
let login = exports.login = function *() {

    let data = yield parse(this);
    let user = new User(data);

    let result = yield user.verify(getCollection(this));

    if(result.errors) {
        this.throw(401, JSON.stringify(result));
    }

    this.body = {
        token: jwt.sign({id:result.data._id}, Constants.SECRET)
    };
};

/**
* Get user profile information
*/
let profile = exports.profile = function *() {
    let result = yield User.findById(getCollection(this), this.user.id);
    if(result.errors) {
        this.throw(401, JSON.stringify(result));
    }
    this.body = result;
};

// Register the API endpoints
let register = exports.register = function(router) {
    router.post('/users', createUser);
    router.post('/users/login', login);
    router.get('/me', authLib.isAuth, profile);
};