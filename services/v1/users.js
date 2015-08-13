"use strict";
let parse = require('co-body'),
    db = require('../../db'),
    User = require('../../models/user'),
    authLib = require('../../lib/authlib'),
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
    let result = yield User.create(getCollection(this), data);
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
    let result = yield User.verify(getCollection(this), data.emailId, data.password);
    if(result.errors) {
        this.throw(401, JSON.stringify(result));
    }
    this.body = {
        token: jwt.sign({id:result._id}, Constants.SECRET)
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

/**
* Update user profile
*/
let updateProfile = exports.updateProfile = function *() {
    let data = yield parse(this);
    let result = yield User.update(getCollection(this), this.user.id, data);
    if(result.errors) {
        this.throw(400, JSON.stringify(result));
    }
    this.body = result;
};

// Register the API endpoints
let register = exports.register = function(router) {
    router.post('/users', createUser);
    router.post('/users/login', login);
    router.get('/me', authLib.isAuth, profile);
    router.put('/me', authLib.isAuth, updateProfile);
};