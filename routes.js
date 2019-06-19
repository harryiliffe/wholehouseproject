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

router.get('/add', function (req, res) {
  tags = JSON.stringify(db.get('tags'));
    res.render('add', {
      title: "Whole House Project",
      name: "Harry",
      tags: tags
    });
});

router.get("/view", function(req, res) {
  item = db.get('items')
           .getById(req.query.itemID)
           .value();

  res.render('view', {
    title: "Whole House Project",
    name: "Harry",
    item: item
  });
});

router.post('/submit', function (req, res) {
  console.log("Received Data")

  const data = req.fields

  //process tags
  //parse tagString
  tagArray = data.tags.split(",");
  data.tags = tagArray;

  dbTags = db.get("tags");
  db.set("tags", dbTags.union(tagArray).value()).write();


  //add data to db
  item = db.get('items')
    .insert(data)
    .write()


  //proccess files
  const photos = req.files.photos
  //make directory
  folder = path.join( 'public/images/' +item.id)
  if(!fs.existsSync(folder)){
    fs.mkdir(folder);
  }

  //move files
  if(Array.isArray(photos)){
    console.log("Multiple files detected")
  } else if (photos.type != "application/octet-stream"){
    n = "";
    while(fs.existsSync(path.join(folder, item.title + n+".jpg"))){
      n => n + 1;
    }
    fs.rename(photos.path, path.join(folder, item.title + n+".jpg"));

    db.get("items")
      .getById(item.id)
      .assign({imagePath:[]})
      .get("imagePath")
      .push(path.join('images/',item.id, item.title + n+".jpg"))
      .write();
  }

  console.log("Data Received. Added Item: " + item.id);
  res.send({"id":item.id,"tags":dbTags.value()});

});

module.exports = router;
