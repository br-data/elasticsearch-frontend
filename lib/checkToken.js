// Checks if a token is valid
const passport = require('passport');

function checkToken() {
  return (req, res, next) => {
    return passport.authenticate('bearer', {
      session: false
    }, (error, user) => {
      if (!user) {
        if (error) {
          res.status(401);
          res.json({ error: error.message });
          res.end();
        } else {
          res.status(401);
          res.json({ error: 'Please provide an API token' });
          res.end();
        }
      } else {
        next();
      }
    })(req, res, next);
  };
}

module.exports = checkToken;
