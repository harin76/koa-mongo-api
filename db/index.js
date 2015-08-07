"use strict";
let thunkify = require('thunkify'),
    ObjectID = require('mongodb').ObjectID,
    _ = require('lodash');
/**
* A generator function that fires a query passed in as parameter and returns the result
*  Uses page and limit parameters to return paginated result.
*
* @param {object} coll      An object representing the mongo db collection that needs to be queried
* @param {object} query     The find query to be performed on the collection
* @param {number} page      Requested page
* @param {number} limit     Requested limit
*/
let find = exports.find = function *(coll, query, page, limit) {
    let skip = page > 0 ? ((page - 1) * limit) : 0;
    let cursor = coll.find(query)
        .sort({_id:-1})
        .skip(skip)
        .limit(limit);
    cursor.toArray = thunkify(cursor.toArray);
    return yield cursor.toArray();
};
/**
* Find an object by its id
* @param {object} coll      An object representing the mongo db collection to be queried
* @param {string} oid       MongoDB ObjectId in string form
*/
let findById = exports.findById = function *(coll, oid) {
    let findOne = coll.findOne;
    coll.findOne = thunkify(findOne);
    return yield coll.findOne({_id:ObjectID(oid)});
};
/**
* Find a single object with query passed in as parameter
*
* @param {object} coll      An object representing the mongo db collection to be queried
* @param {object} query     The query parameters for the operation
*/
let findOne = exports.findOne = function *(coll, query) {
    let findOne = coll.findOne;
    coll.findOne = thunkify(findOne);
    return yield coll.findOne(query);
};
/**
* Insert a document into the mongodb collection
*
* @param {object} coll      An object representing the mongo db collection to insert into
* @param {object} payload   The payload to be inserted as a mongo document
*/
let insert = exports.insert = function *(coll, payload) {
    let insert = coll.insert;
    coll.insert = thunkify(insert);
    return yield coll.insert(payload);
};
/**
* Update a document into the mongodb collection based on the criteria
*
* @param {object} coll      An object representing the mongo db collection to update
* @param {object} criteria  An object representing the document selection criteria
* @param {object} payload   The payload to be inserted as the document
*/
let update = exports.update = function *(coll, criteria, payload) {
    let update = coll.update;
    coll.update = thunkify(update);
    // if the criteria contains _id attribute, convert it into objectid
    if(_.has(criteria, '_id')) {
        criteria._id = ObjectID(criteria._id);
    }
    return yield coll.update(criteria, {$set: payload});
};