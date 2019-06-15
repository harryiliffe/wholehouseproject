// app.js
//EXPRESS STUFF
const path = require('path')
const fs = require('fs')
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const formidableMiddleware = require('express-formidable');

//HELPER STUFF
const underscore = require('underscore');
const shortid = require('shortid');

//DATABASE STUFF
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db/db.json');

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



//SETUP EXPRESS + HANDLEBARS

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(formidableMiddleware({
    uploadDir: 'tmp_uploads',
    multiples: true, // req.files to be arrays of files
    keepExtensions: true
}));

app.use(express.static('public'));


//ROUTE THINGS
app.get('/', function (req, res) {
    var items = db.get('items').value(); // Find all items in the collection
    var user = db.get('user').value()
    res.render('home', {
      title: "Whole House Project",
      user: user,
      items: items

    });
});

app.get('/add', function (req, res) {
    res.render('add', {
      title: "Whole House Project",
      name: "Harry"

    });
});

app.get("/view", function(req, res) {
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

app.post('/submit', function (req, res) {
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



const server = app.listen(3000, ()=> {
  console.log('Whole House Project listening on: 3000');
});
