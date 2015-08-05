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
* @param {object} data      The data to be sanitized
*/
let sanitize = exports.sanitize = function (data) {
    return _.pick(_.defaults(data, user), _.keys(user));
};

/**
* Valdates data passed in against the schema
* @param {object} data  Data to be validated against the schema
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