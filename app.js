// app.js
//EXPRESS STUFF
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const routes = require('./routes/index');
const formidableMiddleware = require('express-formidable');
const session = require('express-session');
const LowdbStore = require('lowdb-session-store')(session);
const db = require('./db');

//SETUP EXPRESS + HANDLEBARS
app.use(session({
  secret: 'oaehgajehliaehfaweoiucnweoprunpoecunrpoaecnrpoeharpoe',
  resave: false,
  saveUninitialized: true,
  store: new LowdbStore(db.get('sessions'), {
    ttl: 86400
  })
}))

app.engine('.hbs', exphbs({
  extname: '.hbs',
  helpers: {
    default: function (value, safeValue) {
        var out = value || safeValue;
        return out;
    }
  },
  helpers:require('handlebars-helpers')()

}));

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
