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
    tagList: JSON.stringify(db.get("items").flatMap("tags").uniq()),
    collectionList: JSON.stringify(db.get("items").flatMap("collection").uniq()),
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
  //====== proccess files ======
  const photos = req.files.photos
  //make directory
  folder = path.join( 'public/assets/' +item.id)
  if(!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }

  //make the "assests" db
  if(!db.get("items").getById(item.id).get("assets").value()){
    assetsDB = db.get("items")
                .getById(item.id)
                .assign({assets:[]})
                .get("assets");
    assetsDB.write();
  } else {
    assetsDB = db.get("items")
                .getById(item.id)
                .get("assets");
  }

  //move files
  if(Array.isArray(photos)){
    console.log("Multiple files detected")
  } else if (photos.type != "application/octet-stream"){

    image = assetsDB.insert({type:"image"})
            .write();

    newPath = path.join(folder, item.title + "-"+ image.id + ".jpg")
    fs.renameSync(photos.path, newPath);

    assetsDB.getById(image.id)
      .assign({path:path.join('/assets' ,item.id, item.title + "-"+ image.id + ".jpg")})
      .write();
  }

  console.log("Data Received. Added Item: " + item.id);
  res.send({"item":item,"tags":db.get("items").flatMap("tags").uniq().value()});

});

module.exports = router;
