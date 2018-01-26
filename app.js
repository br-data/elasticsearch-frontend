const path = require('path');

const express = require('express');
const session = require('express-session');
const app = express();

const bcrypt = require('bcrypt');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const flash = require('req-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes');
const findUser = require('./lib/findUser');

const config = require('./config');

// Copy page config to global
app.locals.page = config.page;

// Set the authentication strategy for the web interface
passport.use(new LocalStrategy(
  (username, password, callback) => {
    findUser.byUsername(username, config.users, (error, user) => {
      if (error) { return callback(null, false, error); }
      if (user) {
        // Check if the passwort matches the salted hash
        bcrypt.compare(password, user.password, (passwordError, isValid) => {
          if (passwordError) { return callback(passwordError); }
          if (isValid) { return callback(null, user); }
          return callback(null, false, new Error('Wrong password'));
        });
      }
    });
  }
));

// Set the authentication strategy for API endpoints
passport.use(new BearerStrategy(
  (token, callback) => {
    findUser.byToken(token, config.users, (error, user) => {
      if (error) { return callback(error, false, error); }
      if (user) { return callback(null, user, { scope: 'all' }); }
    });
  }
));

passport.serializeUser((user, callback) => {
  callback(null, user.id);
});

passport.deserializeUser((id, callback) => {
  findUser.byId(id, config.users, (error, user) => {
    if (error) { return callback(error); }
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
app.use((req, res) => {
  res.status(404);
  res.render('error', {
    title: 'Page Not Found (404)',
    url: req.url
  });
});

// Handle 500 internal server errors
app.use((error, req, res) => {
  res.status(500);
  res.render('error', {
    title: 'Internal Server Error (500)',
    error: error,
    url: req.url
  });
});

module.exports = app;
