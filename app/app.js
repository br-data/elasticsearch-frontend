const path = require('path');

const express = require('express');
const session = require('express-session');
const app = express();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const flash = require('req-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes');
const findUser = require('./lib/findUser');

const config = require('./config');

app.locals.page = config.page;

// Configure the local strategy for use by Passport.
passport.use(new LocalStrategy(
  (username, password, callback) => {
    findUser.byUsername(username, config.users, (err, user) => {
      if (err) { return callback(err); }
      if (!user) { return callback(null, false, { message: 'Could not find user.' }); }
      if (user.password != password) { return callback(null, false, { message: 'Wrong password. Try again.' }); }
      return callback(null, user);
    });
  }));

passport.serializeUser((user, callback) => {
  callback(null, user.id);
});

passport.deserializeUser((id, callback) => {
  findUser.byId(id, config.users, (err, user) => {
    if (err) { return callback(err); }
    callback(null, user);
  });
});

// Configure view engine to render pug templates.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Connect routes
app.use('/', routes);

// Handle 404 errors
app.use(function(req, res) {
  res.status(404);
  res.render('error', {
    title: 'Page not Found (404)',
    url: req.url
  });
});

// Handle 500 internal server errors
app.use(function(err, req, res) {
  res.status(500);
  res.render('error', {
    title: 'Internal Server Error (500)',
    error: err,
    url: req.url
  });
});

app.listen(3000);
