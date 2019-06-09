const express = require('express');
// const db = require('./db');
const router = express.Router();

router.get('/', function (req, res) {
    var dbItems = []
    var items = db.get('items').value() // Find all users in the collection
    items.forEach(function(item) {
      dbItems.push(item.name); // adds their info to the dbUsers value
    });
    res.send(dbItems);
    // res.render('home', {
    //   title: "Whole House Project",
    //   style: "bootstrap.css",
    //   name: "Harry"
    //
    // });
});

router.get('/add', function (req, res) {
    res.render('add', {
      title: "Whole House Project",
      style: "bootstrap.css",
      name: "Harry"

    });
});

module.exports = router;
