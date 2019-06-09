// app.js
//EXPRESS STUFF
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const bodyParser = require('body-parser');
//DATABASE STUFF
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db/db.json')
const db = low(adapter)
db._.mixin(require('underscore-db'))


// db.defaults({ items: [], user: {}, count: 0 })
//   .write()

// db.set('user.name', 'harry')
//     .write()

// db.get('items')
//   .push({ id: 2, title: 'Xbox Controller', description: 'Xbox 360 controller', image:"xboxcontroller.jpg"})
//   .write()
//
// db.update('count', n => n + 1)
//   .write()


//SETUP EXPRESS + HANDLEBARS

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));



//ROUTE THINGS
app.get('/', function (req, res) {
    var items = db.get('items').value(); // Find all users in the collection
    var user = db.get('user').value()
    res.render('home', {
      title: "Whole House Project",
      style: "bootstrap.css",
      user: user,
      items: items

    });
});

app.get('/add', function (req, res) {
    res.render('add', {
      title: "Whole House Project",
      style: "bootstrap.css",
      name: "Harry"

    });
});

app.post('/submit', function (req, res) {
  const data = req.body;
  console.log(data);

  db.get('items')
    // .push({ id: 2, title: 'Xbox Controller', description: 'Xbox 360 controller', image:"xboxcontroller.jpg"})
    .insert(data)

    .write()

  res.end()
});



const server = app.listen(3000, ()=> {
  console.log('express-handlebars example server listening on: 3000');
});
