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

router.get('/', function (req, res) {
  tags = JSON.stringify(db.get('tags'));
    res.render('add', {
      title: "Whole House Project",
      name: "Harry",
      tags: tags
    });
});

router.post('/', function (req, res) {
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
      .push(path.join('/images/',item.id, item.title + n+".jpg"))
      .write();
  }

  console.log("Data Received. Added Item: " + item.id);
  res.send({"id":item.id,"tags":dbTags.value()});

});

module.exports = router;
