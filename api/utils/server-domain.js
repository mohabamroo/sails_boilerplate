module.exports = req => {
  var fullUrl = req.protocol + '://' + req.get('host');
  return fullUrl;
};
