// app.js
//EXPRESS STUFF
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const routes = require('./routes');
const formidableMiddleware = require('express-formidable');




//SETUP EXPRESS + HANDLEBARS

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(formidableMiddleware({
    uploadDir: 'tmp_uploads',
    multiples: true, // req.files to be arrays of files
    keepExtensions: true
}));

app.use(express.static('public'));

app.use('/', routes)

const server = app.listen(3000, ()=> {
  console.log('Whole House Project listening on: 3000');
});
