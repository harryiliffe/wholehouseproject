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

db.defaults({ items: [], tags:[], user: {}, count: 0 })
  .write()

db.set('user.name', 'harry')
    .write()



//ROUTE THINGS
router.get('/', function (req, res) {
    var items = db.get('items').value(); // Find all items in the collection
    var user = db.get('user').value()
    res.render('home', {
      title: "Whole House Project",
      user: user,
      items: items

    });
});

router.use("/view", require("./view"));

router.use("/add", require("./add"));

module.exports = router;
