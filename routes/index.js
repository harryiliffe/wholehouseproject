const express = require('express');
const router = express.Router();

//DATABASE STUFF
const db = require('../db');



//ROUTE THINGS
router.get('/', function (req, res) {
    var items = db.get('items').value(); // Find all items in the collection
    var user = db.get('user').value()
    res.render('home', {
      title: "Whole House Project",
      user: user,
      items: items,
      navSearch: true,
      tagList: db.get("items").flatMap("tags").uniq().value(),
      collectionList: db.get("items").flatMap("collection").uniq().value()
    });
});

router.use("/view", require("./view"));

router.use("/add", require("./add"));

module.exports = router;
