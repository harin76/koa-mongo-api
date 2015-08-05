"use strict";

let _ = require('lodash'),
    UserSchema = require('../schemas/user'),
    bcrypt = require('co-bcryptjs'),
    db = require('../db');

/**
* Define the user model.
* The method acts as a constructor which creates the user object based on 
* the fields passed in as its parameter. Utilizes the schema defined in {UserSchema}
*
* @param {object} data  Attributes of the user model
*/
var User = function (data) {

    this.data = this.sanitize(data);
};

User.prototype.data = {};

/**
* Hashes the password with salt
* @param {string} password 
*/
User.prototype.hashPassword = function *(password) {
    let salt = yield bcrypt.genSalt(10);
    return yield bcrypt.hash(password, salt);
};

/**
* Getter for the {User} object
* 
* @param {string} prop  The property name whaich needs to be retrieved
*/
User.prototype.get = function (prop) {
    return this.data[name];
};

/**
* Setter for the {User} object
* 
* @param {string} prop      The property to be set
* @param {?}      value     The value of the property
*/
User.prototype.set = function (prop, value) {
    this.name = value;
};

/**
* Sanitizes the data against its schema
* @param {object} data      The data to be sanitised 
*/
User.prototype.sanitize = function (data) {
    data = data || {};
    return UserSchema.sanitize(data);
};

/**
* Validates the user model
*/
User.prototype.validate = function *(data) {
    return UserSchema.validate(data);
};


/**
* Create a new user in the database
*
* @param {object} coll  A mongodb collection
*/
User.prototype.create = function *(coll) {
    let errors = yield this.validate(this.data);
    
    if(errors) {
        return {
            errors: errors
        };
    }

    let dbUser = yield db.findOne(coll, {emailId: this.data.emailId});

    if(dbUser) {
        return {errors: [{message: 'EmailId already exists in the database'}]};
    }

    this.data.password = yield this.hashPassword(this.data.password);

    let inserted = yield db.insert(coll, this.data);

    return {data: inserted};
};

/**
* Verifies the existing user based on the password
*
* @param {object} coll  A mongodb collection
*/
User.prototype.verify = function *(coll) {
    let errors = yield this.validate(this.data);
    
    if(errors) {
        return {
            errors: errors
        };
    }

    let dbUser = yield db.findOne(coll, {emailId: this.data.emailId});

    if(!dbUser || (!(yield bcrypt.compare(this.data.password, dbUser.password)))){
        return {errors: [{message: 'Invalid username or password'}]};
    }

    return {data:dbUser};
};

module.exports = User;