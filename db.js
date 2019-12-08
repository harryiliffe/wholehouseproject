const path = require('path')
const fs = require('fs')

const express = require('express');
const router = express.Router();

//DATABASE STUFF
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db/db.json');
const shortid = require('shortid');
const db = low(adapter);

db._.mixin(require('lodash-id'));
db._.mixin({
    createId: function(collectionName, doc) {
        return shortid.generate();
    }
});

db.defaults({sessions:[], userdata:[]}).write();

module.exports = db;
