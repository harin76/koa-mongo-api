"use strict";

let frisby = require('icedfrisby'),
Joi = require('joi'),
app = require('../app'),
Chance = require('chance'),
assert = require('assert');


let BASE_URL = '/api/v1/';
let chance = new Chance();

/**
* Create a random user, please note that this is not guaranteed to be unique,
* however it is good enough for our puposes
*/ 
let createUser = function () {
    
    let fname = chance.first(),
        lname = chance.last(),
        cname = chance.word({length: 5});

    return {
        emailId: fname + '_' + lname + '@' + cname + '.com',
        firstName: fname,
        lastName : lname,
        password: 'password'  
    };
};

let testUser = createUser();

frisby.globalSetup({
    request: {
        headers: {'Content-Type': 'application/json'}
    }});

frisby.create('Create a valid user')
    .useApp(app)
    .post(BASE_URL+'users', createUser(), {json:true})
    .expectStatus(201)
.toss();

frisby.create('Create an invalid user')
    .useApp(app)
    .post(BASE_URL + 'users', {}, {json:true})
    .expectStatus(400)
.toss();

frisby.create('create a user and login')
    .useApp(app)
    .post(BASE_URL+'users', testUser, {json:true})
    .expectStatus(201)
    .afterJSON(function(json){
        frisby.create('login the user')
            .useApp(app)
            .post(BASE_URL + 'users/login', {emailId:testUser.emailId, password: testUser.password}, {json:true})
            .expectStatus(200)
            .expectJSONTypes({
                token: Joi.string().required()
            })
        .toss();
    })
.toss();

frisby.create('Access profile without login')
    .useApp(app)
    .get(BASE_URL + 'me')
    .expectStatus(401)
.toss();


frisby.create('Access profile after login')
    .useApp(app)
    .post(BASE_URL + 'users/login', {emailId:testUser.emailId, password: testUser.password}, {json:true})
    .expectStatus(200)
    .afterJSON(function(json){
        frisby.create('Get logged in user profile')
            .useApp(app)
            .addHeader('Authorization', 'Bearer ' + json.token)
            .get(BASE_URL + 'me')
            .expectStatus(200)
            .afterJSON(function(profile) {
                assert.equal(profile.data.emailId, testUser.emailId);
            })
        .toss();
    })
.toss();

frisby.create('Profile should not contain password attribute')
    .useApp(app)
    .post(BASE_URL + 'users/login', {emailId:testUser.emailId, password: testUser.password}, {json:true})
    .expectStatus(200)
    .afterJSON(function(json){
        frisby.create('Get logged in user profile')
            .useApp(app)
            .addHeader('Authorization', 'Bearer ' + json.token)
            .get(BASE_URL + 'me')
            .expectStatus(200)
            .afterJSON(function(profile) {
                // Profile should not contain the password
                assert.equal(profile.data.password, undefined);
            })
        .toss();
    })
.toss();
