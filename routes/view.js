const express = require('express');
const router = express.Router();

//DATABASE STUFF
const db = require('../db');

//=========Routes=========//

router.get("/object", function(req, res) {
    const sess = req.session;
    const userdb = db.get("userdata").find({"user":sess.user});
    item = userdb.get('items')
           .getById(req.query.itemID)
           .value();
    console.log("Serving "+item.id+ " to be veiwed.")
    res.render('view', {
        title: "Whole House Project",
        item: item,
        photos: userdb.get('items').getById(req.query.itemID).get("assets").filter({type: "image"}).value()
    });
});


module.exports = router;
