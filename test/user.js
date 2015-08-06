"use strict";

let frisby = require('icedfrisby'),
Joi = require('joi'),
app = require('../app'),
Chance = require('chance');

let URL_BASE = '/api/v1/';
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
    }
});

frisby.create('Create a valid user')
    .useApp(app)
    .post(URL_BASE+'users', createUser(), {json:true})
    .expectStatus(201)
.toss();

frisby.create('Create an invalid user')
    .useApp(app)
    .post(URL_BASE + 'users', {}, {json:true})
    .expectStatus(400)
.toss();

frisby.create('create a user and login')
    .useApp(app)
    .post(URL_BASE+'users', testUser, {json:true})
    .expectStatus(201)
    .afterJSON(function(json){
        frisby.create('login the user')
        .useApp(app)
        .post(URL_BASE + 'users/login', {emailId:testUser.emailId, password: testUser.password}, {json:true})
        .expectStatus(200)
        .expectJSONTypes({
            token: Joi.string().required()
        })
    .toss()
    })
.toss();