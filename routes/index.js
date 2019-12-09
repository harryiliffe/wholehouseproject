const express = require('express');
const router = express.Router();

//DATABASE STUFF
const db = require('../db');

//CHECK LOGIN
function loginRequired(req, res, next) {
    var sess = req.session;
    if (!sess.user) {
        return res.status(401).redirect("/login");
    }
    next();
}

router.get("/login", function (req, res) {
    res.render("login");
});

router.get("/logout", function (req, res) {
    var sess = req.session;
    console.log("New logout: " + sess.user);
    sess.user = "";
    res.render("login");
});

router.post("/login", function (req, res) {
    const sess = req.session;
    const data = req.fields;
    sess.user = data.username;
    if(!db.get("userdata").find({"user":sess.user}).value()){
      db.get("userdata").push({"user":sess.user}).write();
      db.get("userdata").find({"user":sess.user}).defaults({"items": [], "tags":[], "collections":[]}).write();
    }
    console.log("New login: " + sess.user);
    res.redirect("/")
});

//ROUTE THINGS
router.get('/', loginRequired, function (req, res) {
    var sess = req.session;
    const userdb = db.get("userdata").find({"user":sess.user});
    var items = userdb.get('items').value(); // Find all items in the collection
    res.render('home', {
      title: "Whole House Project",
      user: sess.user,
      items: items,
      navSearch: true,
      tagList: userdb.get("items").flatMap("tags").uniq().value(),
      collectionList: userdb.get("items").flatMap("collection").uniq().value()
    });
});

router.use("/view", loginRequired, require("./view"));

router.use("/add", loginRequired, require("./add"));

module.exports = router;
