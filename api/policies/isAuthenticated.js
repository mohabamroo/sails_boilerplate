const makeError = require('../utils/make-error');

module.exports = async function(req, res, next) {
  const headerToken = req.headers['x-access-token'];
  if (!headerToken) {
    res
      .status(401)
      .json({ message: 'Missing authentication token.' });
    return;
  }

  sails.helpers.jwTokenVerify(headerToken).switch({
    error: function(err) {
      return res.serverError(err);
    },
    // eslint-disable-next-line handle-callback-err
    invalid: function(err) {
      return res
        .status(401)
        .json(makeError(401, 'Cannot verify token'));
    },
    success: function(user) {
      req.currentUser = user;
      return next();
    }
  });
};
