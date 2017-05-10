const express = require('express');
const router = express.Router();
const passport = require('passport');
const checkLogin = require('../lib/checkLogin');
const queryElastic = require('../lib/queryElastic');

// Define routes
router.get('/',
  checkLogin({ redirectTo: 'login' }),
  (req, res) => {
    res.render('search', {
      error: req.error,
      result: req.result,
      query: req.query,
      user: req.user
    });
  });

router.get('/login',
  (req, res) => {
    res.render('login', {
      error: { message: req.flash('error') }
    });
  });

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    res.redirect('/');
  });

router.get('/logout',
  checkLogin({ redirectTo: 'login' }),
  (req, res) => {
    req.logout();
    res.redirect('/');
  });

router.get('/search',
  checkLogin({ redirectTo: 'login' }),
  queryElastic(),
  (req, res) => {
    res.render('result', {
      error: req.error,
      result: req.result,
      query: req.query,
      user: req.user
    });
  });

module.exports = router;
