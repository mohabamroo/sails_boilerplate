module.exports = function(error, res) {
  console.error('\x1b[31m', 'ERROR: ', error.name);
  console.error(
    '\x1b[31m',
    'CODE:',
    '\x1b[41m',
    '\x1b[33m',
    error.code,
    '\x1b[40m'
  );
  console.error(
    '\x1b[1m',
    '\x1b[31m',
    'Message: ',
    error.message || 'Internal Server error, no explaination.'
  );
  res.status(error.code || 500).json({ ...error });
};
