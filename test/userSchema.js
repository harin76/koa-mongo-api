"use strict";

let assert = require('assert'),
    userSchema = require('../schemas/user');

require('co-mocha');

describe ('User model tests', function(){
    

    it('should pull only valid fields from schema', function *(){
        let data = {firstName: 'James', 'lastName': 'Cocker'};
        let user = userSchema.sanitize(data);
        assert.equal(Object.keys(user).length, 8);
        assert.equal(user.firstName, 'James');
    });


    it('should expect valid email & password for a user', function*(){
        let data = {firstName: 'James', 'lastName': 'Cocker'};
        let result = userSchema.validate(data);
        assert(result);
        assert.equal(result.length, 3);
    });

    it('should expect a valid emailId', function *(){
        let data = {emailId: 'abc@corporg', 'password': '1234'};
        let result = userSchema.validate(data);
        assert.equal(result.length, 1);
    });

    it('should expect a valid password', function *(){
        let data = {emailId: 'abc@corporg', 'password': null};
        let result = userSchema.validate(data);
        assert.equal(result.length, 2);
    });

    it('should not return errors if emailid and password are provided', function *(){
        let data = {emailId: 'abc@corp.org', 'password': '1234'};
        let result = userSchema.validate(data);
        assert.equal(result, null);
    });
});