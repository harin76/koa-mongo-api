"use strict";
let validr = require('validr'),
    _ = require('lodash');

/**
* Define the user schema here
*/
let user = {
    emailId: null,
    password: null,
    firstName: null,
    lastName: null,
    mobile: null,
    title: null,
    roles: ['*'],
    created: Date.now()
};

exports.schema = user;

/**
* creates a sanitised version of the object based on the schema definition
*
* @param  {object} data         The data to be sanitized
* @return {object}              sanitized user object
*/
let sanitize = exports.sanitize = function (data) {
    return _.omit(_.pick(_.defaults(data, user), _.keys(user)), _.isNull);
};

/**
* Valdates data passed in against the schema
*
* @param {object} data      Data to be validated against the schema
* @return {Array}           An array containing validation error if any otherwise null
*/
let validate = exports.validate = function (data) {
    let userValidator = new validr(data);
    userValidator
        .validate('emailId', {
            isLength: 'EmailId is required',
            isEmail: 'EmailId must be a valid email id'
        }).isLength(1).isEmail();
    userValidator
        .validate('password', 'Password is required')
        .isLength(1);
    return userValidator.validationErrors();
};

/**
* Validates if the data passed is suitable for update.
*
* @param {object} data              Data to be validated for the update operation
* @return {Array}                   An array of error if not valid otherwise null;
*/
let validateForUpdate = exports.validateForUpdate = function(data) {
    let result = null;
    if(_.has(data, 'emailId')
        || _.has(data, 'password')
        || _.has(data, 'roles')) {
        result = {errors: [{message: 'Cannot update emailId, password or roles'}]};
    }
    return result;
};

/**
* Returns the user object with right attributes for an uodate
*/
let getObjectForUpdate = exports.prepareForUpdate = function (data) {
    return _.pick(data, ['firstName', 'lastName', 'mobile', 'title']);
};

/**
* Returns clean version of the user omitting sensitive attributes
*
* @param    {object} data           Data to be cleaned up
* @return   {object}                Cleaned data with password and role fields omitted
*/
let clean = exports.clean = function (data) {
    return _.omit(data, ['password', 'roles']);
};