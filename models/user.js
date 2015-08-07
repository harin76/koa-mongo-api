"use strict";
let _ = require('lodash'),
    UserSchema = require('../schemas/user'),
    bcrypt = require('co-bcryptjs'),
    db = require('../db');
let User = function() {};
/**
* Hashes the password with salt
* @param {string} password              The password string to be hashed
* @return {string}                      The hashed password
*/
User.hashPassword = function *(password) {
    let salt = yield bcrypt.genSalt(10);
    return yield bcrypt.hash(password, salt);
};
/**
* Create a new user in the database
*
* @param {object} coll              A mongodb collection
* @param {object} payload           User data to be created
*/
User.create = function *(coll, payload) {
    let user = UserSchema.sanitize(payload);
    let errors = UserSchema.validate(user);
    if(errors) {
        return {
            errors: errors
        };
    }
    let dbUser = yield db.findOne(coll, {emailId: user.emailId});
    if(dbUser) {
        return {errors: [{message: 'EmailId already exists in the database'}]};
    }
    user.password = yield User.hashPassword(user.password);
    let createdUser = yield db.insert(coll, user);
    return UserSchema.clean(createdUser);
};
/**
* Verifies the existing user based on the password
*
* @param {object} coll          A mongodb collection
*/
User.verify = function *(coll, emailId, password) {
    let dbUser = yield db.findOne(coll, {emailId: emailId});
    if(!dbUser || (!(yield bcrypt.compare(password, dbUser.password)))){
        return {errors: [{message: 'Invalid username or password'}]};
    }
    return UserSchema.clean(dbUser);
};
/**
* Find user by id, please note that the method is at the object level (not in the prototype)
*
* @param {object} coll              A mongodb collection
* @param {string} id                The id of the user object to be fetched
*/
User.findById = function *(coll, id) {
    let dbUser = yield db.findById(coll, id);
    if(!dbUser) {
        return {errors: [{message: 'Could not find user with the id'}]};
    }
    // Return data omitting the password
    return UserSchema.clean(dbUser);
};
/**
* Updates a user based on its id
*
* @param {object} coll              A mongodb collection
* @param {object} payload           Payload containing data to be updated along with id attribute
*/
User.update = function *(coll, id, payload) {
    let errors = UserSchema.validateForUpdate(payload);
    if(errors) {
        return {
            errors : errors
        };
    }
    let user = UserSchema.prepareForUpdate(payload);
    if(!user) {
        return {errors: [{message: 'Invalid user data passed for update'}]};
    }
    let result = yield db.update(coll, {_id:id}, user);
    let dbUser = yield db.findById(coll, id);
    return UserSchema.clean(dbUser);
};
module.exports = User;