const path = require('path')
const fs = require('fs')

const express = require('express');
const router = express.Router();

//DATABASE STUFF
const db = require('../db');


function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

//=========Routes=========//

router.get('/', function (req, res) {
  var item;
  if(req.query.itemID){
    item = db.get('items')
             .getById(req.query.itemID)
             .value();
  }
  res.render('add', {
    item: item,
    tagList: JSON.stringify(db.get("tags")),
    collectionList: JSON.stringify(db.get("collections")),
    submitAlert: item ?  "Object Successfully Updated" : "New Object Successfully Submitted",
    invalidID: req.query.itemID && !item ? "Invalid itemID" : ""
  });
});

router.post('/', function (req, res) {
  const data = req.fields

  //process tags
  //parse tagString
  tagArray = data.tags.split(",");
  data.tags = tagArray;

  db.set("tags", db.get("tags").union(tagArray).value()).write();
  db.set("collections", db.get("collections").union([data.collection]).value()).write();

  //add data to db
  if(data.itemID){
    item = db.get("items")
             .getById(data.itemID)
             .assign(data)
             .write();
  } else {
    item = db.get('items')
             .insert(data)
             .write();
  }

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
  res.send({"item":item,"tags":db.get("tags").value()});

});

module.exports = router;
