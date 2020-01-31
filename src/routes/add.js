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


//=====DELETE IMAGE=====//
router.delete("/", function (req, res) {
  const data = req.fields;
  const sess = req.session;
  const userdb = db.get("userdata").find({"user":sess.user});
  imageDB = userdb.get('items')
              .getById(data.itemID)
              .get("assets");
  image = imageDB.getById(data.imageID).value();

  console.log(sess.user + ": Removing Image: " + image.id);
  fs.unlink(path.join("public",image.path), function(err){
    if(err){
      console.log(err);
    }
    imageDB.remove({id:data.imageID}).write();
    res.send("Success");
  });
});

router.get('/', function (req, res) {
  var item;
  const sess = req.session;
  const userdb = db.get("userdata").find({"user":sess.user});
  if(req.query.itemID){
    item = userdb.get('items')
             .getById(req.query.itemID)
             .value();
    photos = userdb.get('items').getById(req.query.itemID).get("assets").filter({type: "image"}).value();
  }
  res.render('add', {
    item: item,
    itemJSON: JSON.stringify(item),
    user: sess.user,
    tagList: JSON.stringify(userdb.get("items").flatMap("tags").uniq()),
    materialList: JSON.stringify(userdb.get("items").flatMap("materials").uniq()),
    collectionList: JSON.stringify(userdb.get("items").flatMap("collection").uniq()),
    photos: req.query.itemID ? userdb.get('items').getById(req.query.itemID).get("assets").filter({type: "image"}).value() : "",
    submitAlert: item ?  "Object Successfully Updated" : "New Object Successfully Submitted",
    invalidID: req.query.itemID && !item ? "Invalid itemID" : ""
  });
});

router.post('/', function (req, res) {
  const data = req.fields
  const sess = req.session;
  const userdb = db.get("userdata").find({"user":sess.user});
  //process tags
  //parse tagString
  if(data.tags){
    tagArray = data.tags.split(",");
    data.tags = tagArray;
  }
  if(data.materials){
    materialsArray = data.materials.split(",");
    data.materials = materialsArray;
  }

  //add data to db(sess.user)
  if(data.id){
    item = userdb.get("items")
             .getById(data.id)
             .assign(data)
             .write();
  } else {
    item = userdb.get('items')
             .insert(data)
             .write();
  }
  //====== proccess files ======
  const photos = req.files.compressedPhotos
  //make directory
  folder = path.join( 'public/assets/' +item.id)
  if(!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }

  //make the "assests" db(sess.user)
  if(!userdb.get("items").getById(item.id).get("assets").value()){
    assetsDB = userdb.get("items")
                .getById(item.id)
                .assign({assets:[]})
                .get("assets");
    assetsDB.write();
  } else {
    assetsDB = userdb.get("items")
                .getById(item.id)
                .get("assets");
  }

  //move files
  if(Array.isArray(photos)){
    for(var i = 0; i<photos.length;i++){
      uploadPhoto(photos[i], assetsDB, item);
    }
  } else if (photos.type != "application/octet-stream"){
    uploadPhoto(photos, assetsDB, item);
  }

  console.log(sess.user + ": Data Received. Added Item: " + item.id);
  res.send({"item":item,"tags":userdb.get("items").flatMap("tags").uniq().value()});

});

function uploadPhoto(photo, assetsDB, item){
    image = assetsDB.insert({type:"image"})
            .write();
    newPath = path.join(folder, item.title + "-"+ image.id + ".jpg")
    fs.renameSync(photo.path, newPath);

    assetsDB.getById(image.id)
      .assign({path:path.join('/assets' ,item.id, item.title + "-"+ image.id + ".jpg")})
      .write();
}

module.exports = router;
