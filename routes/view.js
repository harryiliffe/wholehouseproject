const express = require('express');
const router = express.Router();

//DATABASE STUFF
const db = require('../db');

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
