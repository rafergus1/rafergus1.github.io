require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const routes = require('./server/routes/routes.js');

//flash messages dependencies:
const session = require('express-session');
const cookieParseer = require('cookie-parser');
const flash = require('connect-flash');

const app = express();

// CONFIGURE
app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParseer('MongoBlogExampleSecure'));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "who is yash?",
    cookie: { secure: false, maxAge: 14400000 },
  })
)
app.use(flash());
app.set('layout', './layouts/main');  //main.ejs is our main template
app.set("view engine", "ejs");
app.use('/', routes);

// START SERVER LISTENING
const port = 3000;
app.listen(process.env.PORT || port, () => {
  console.log(`Server running on port ${port}/`)
});

