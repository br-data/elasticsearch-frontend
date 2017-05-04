const express = require('express');
const router = express.Router();
const passport = require('passport');

const elastic = require('elasticsearch');
const elasticClient = new elastic.Client({ host: 'localhost:9200' });
const elasticIndex = 'kuckucksnest';

const checkLogin = require('../lib/checkLogin');

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

router.get('/match/:query',
  checkLogin(),
  (req, res) => {

    const query = req.params.query;

    elasticClient.search({
      elasticIndex,
      size: 500,
      body: {
        query: {
          multi_match: {
            query,
            type: 'phrase',
            fields: ['body', 'body.folded']
          }
        },
        _source: {
          excludes: ['body*']
        },
        highlight: {
          fields: {
            body: {},
            'body.folded': {}
          }
        }
      }
    }, (error, data) => {

      const result = data.hits.hits ? data.hits.hits : {};

      res.render('result', { user: req.user, result: result, error: error });
    });
  });

module.exports = router;
