module.exports = async function(req, res, next) {
  if (
    req.currentUser.accessLevel === 'admin' ||
    req.currentUser.accessLevel === 'super'
  ) {
    return next();
  } else {
    res
      .status(403)
      .json({ message: 'You are not allowed admin access.' });
  }
};
