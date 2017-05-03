var express = require('express');
var router = express.Router();
var passport = require('passport');

// Define routes.
router.get('/',
  (req, res) => {
    res.render('home', { user: req.user });
  });

router.get('/login',
  (req, res) => {
    res.render('login');
  });

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

router.get('/logout',
  (req, res) => {
    req.logout();
    res.redirect('/');
  });

router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    res.render('profile', { user: req.user });
  });

module.exports = router;
