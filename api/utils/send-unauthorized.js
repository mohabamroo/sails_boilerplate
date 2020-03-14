module.exports = function (res, msg = '') {
  return res.status(403).json({
    message: msg || 'You are not authorized to do this action'
  });
};
