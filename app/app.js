const express = require('express');
const session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const morgan = require('morgan')('combined');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const db = require('./db');
const routes = require('./routes/index');

// Create a new Express application.
const app = express();

// Configure the local strategy for use by Passport.
passport.use(new LocalStrategy(
  (username, password, cb) => {
    db.users.findByUsername(username, (err, user) => {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

// Passport authenticated session persistence.
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  db.users.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Configure view engine to render pug templates.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(morgan);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  // cookie: {
  //   secure: true,
  //   maxAge: 3600000
  // }
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Connect routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

app.listen(3000);

