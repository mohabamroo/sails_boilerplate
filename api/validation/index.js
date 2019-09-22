const validate = require('express-validation');

validate.options({
  allowUnknownBody: false
});

module.exports = validate;
