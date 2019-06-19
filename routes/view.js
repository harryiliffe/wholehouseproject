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

//=========Routes=========//

router.get("/object", function(req, res) {
  item = db.get('items')
           .getById(req.query.itemID)
           .value();
  console.log("Serving "+item.id+ " to be veiwed.")
  res.render('view', {
    title: "Whole House Project",
    name: "Harry",
    item: item
  });
});


module.exports = router;
