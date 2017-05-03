const express = require('express');
const router = express.Router();
const passport = require('passport');

const checkLogin = require('../lib/checkLogin')

// Define routes
router.get('/',
  checkLogin(),
  (req, res) => {
    res.render('search', { user: req.user });
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
  checkLogin(),
  (req, res) => {
    res.render('profile', { user: req.user });
  });

module.exports = router;
