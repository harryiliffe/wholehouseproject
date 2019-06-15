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

db.defaults({ items: [], user: {}, count: 0 })
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
    res.render('add', {
      title: "Whole House Project",
      name: "Harry"
    });
});

router.get("/view", function(req, res) {
  item = db.get('items')
           .getById(req.query.itemID)
           .value();
  console.log(item);

  res.render('view', {
    title: "Whole House Project",
    name: "Harry",
    item: item
  });
});

router.post('/submit', function (req, res) {
  console.log("Received Data")

  const data = req.fields

  //add data to db
  itemID = db.get('items')
    .insert(data)
    .write().id

  //proccess files
  const filename = db.get('items')
                     .getById(itemID)
                     .value().title

  const files = req.files.photos

  //make directory
  folder = path.join( 'public/images/' +itemID)
  if(!fs.existsSync(folder)){
    fs.mkdir(folder);
  }


  //move files
  if(Array.isArray(files) && files.length>0){
    console.log("Multiple files detected")
  } else {
    n = "";
    while(fs.existsSync(path.join(folder, filename + n+".jpg"))){
      n => n + 1;
    }
    fs.rename(files.path, path.join(folder, filename + n+".jpg"));

    db.get('items')
      .getById(itemID)
      .assign({imagePath:[]})
      .get("imagePath")
      .push(path.join('images/',itemID, filename + n+".jpg"))
      .write()
  }
  console.log("Data Received. Added Item: " + itemID);
  res.send(itemID)

});

module.exports = router;
