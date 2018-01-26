// Checks if a user is authenticated
// @TODO Preserve query string on redirect
function checkLogin(options) {
  options = options || {};

  const url = options.redirectTo || '/login';
  const setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;

  return (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (setReturnTo && req.session) {
        req.session.returnTo = req.originalUrl || req.url;
      }
      res.redirect(url);
    }
    next();
  };
}

module.exports = checkLogin;
