const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = (req, model, onlyCountFlag = 0) => {
  let selectQuery;
  let populateQuery;
  if (req.query.select) {
    selectQuery = req.query.select.split(',');
    delete req.query.select;
  }
  if (req.query.populate) {
    populateQuery = req.query.populate.split(',');
    delete req.query.populate;
  } else {
    populateQuery = [];
  }
  const criteria = actionUtil.parseCriteria(req);
  console.log('Fetch Criteria::', criteria);
  for (let index in criteria) {
    try {
      criteria[index] = JSON.parse(criteria[index]);
    } catch (_error) {
      // console.error(error);
    }
  }

  let dataQuery;
  if (!onlyCountFlag) {
    dataQuery = model
      .find()
      .where(criteria)
      .limit(actionUtil.parseLimit(req))
      .skip(actionUtil.parseSkip(req))
      .sort(actionUtil.parseSort(req));

    if (selectQuery) {
      dataQuery = dataQuery.select(selectQuery);
    }
    if (populateQuery.length > 0) {
      populateQuery.forEach(x => {
        dataQuery = dataQuery.populate(x);
      });
    } else {
      dataQuery = dataQuery.populateAll();
    }
  }

  const countQuery = model.count().where(criteria);
  return { dataQuery, countQuery };
};
