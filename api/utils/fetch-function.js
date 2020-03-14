// defines default find action,
// to override sails default find behaviour and response;
// to be used in controllers
const fetchQuery = require('./fetch-query');

module.exports = modelRef => {
  return (req, res) => {
    const { dataQuery, countQuery } = fetchQuery(req, modelRef);
    return Promise.all([dataQuery, countQuery])
      .then(([data, count]) => {
        return res.status(200).json({
          message: 'Fetched data',
          data,
          count
        });
      })
      .catch(err =>
        sendError(makeError(400, err.message, err.name), res)
      );
  };
};
