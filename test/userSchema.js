"use strict";

let assert = require('assert'),
    userSchema = require('../schemas/user');

require('co-mocha');

describe ('User Schema Tests : ', function(){
    

    it('should pull only valid fields from schema', function *(){
        let data = {firstName: 'James', lastName: 'Cocker'};
        let user = userSchema.sanitize(data);
        assert.equal(Object.keys(user).length, 4);
        assert.equal(user.firstName, 'James');
    });


    it('should expect valid email & password for a user', function*(){
        let data = {firstName: 'James', lastName: 'Cocker'};
        let result = userSchema.validate(data);
        assert(result);
        assert.equal(result.length, 3);
    });

    it('should expect a valid emailId', function *(){
        let data = {emailId: 'abc@corporg', password: '1234'};
        let result = userSchema.validate(data);
        assert.equal(result.length, 1);
    });

    it('should expect a valid password', function *(){
        let data = {emailId: 'abc@corporg', password: null};
        let result = userSchema.validate(data);
        assert.equal(result.length, 2);
    });

    it('should not return errors if emailid and password are provided', function *(){
        let data = {emailId: 'abc@corp.org', password: '1234'};
        let result = userSchema.validate(data);
        assert.equal(result, null);
    });

    it('should omit password and roles attributes after clean', function *(){
        let data = {emailId: "abc@test.org", password: '1234', roles: ['*']};
        let result = userSchema.clean(data);
        assert.equal(undefined, result.password);
        assert.equal(undefined, result.roles);
    });

    it('Should only pick firstName, lastName, mobile and title for update', function *(){
        let data = {emailId:"abc@test.org",
                    password: '1234',
                    firstName:'Jack',
                    lastName: 'McCormack',
                    title: 'Mr',
                    mobile: '+919877611234'};
        let result = userSchema.getObjectForUpdate(data);
        assert.equal(4, Object.keys(result).length);
        assert.equal(undefined, result.password);
        assert.equal('Mr', result.title);
    });

    it('should return error if email or role is updated', function *() {
        let data = {emailId:"abc@test.org",
                    password: '1234',
                    firstName:'Jack',
                    lastName: 'McCormack',
                    title: 'Mr',
                    mobile: '+919877611234'};
        let result = userSchema.validateForUpdate(data);
        assert.equal(result.errors.length, 1);
    });

    it('should return null if email or role is not updated', function *() {
        let data = { firstName:'Jack',
                    lastName: 'McCormack',
                    title: 'Mr',
                    mobile: '+919877611234'};
        let result = userSchema.validateForUpdate(data);
        assert.equal(result, null);
    });
});