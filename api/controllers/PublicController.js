const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const async = require('sails/node_modules/async');
const sendError = require('../utils/send-error');
const makeError = require('../utils/make-error');

// To hold functionas available to all system users
module.exports = {
  _config: {
    actions: true,
    shortcuts: true,
    rest: true
  },
  find: function (req, res) {
    let { model: modelName, searchTerm, searchFields } = req.query;
    delete req.query.searchTerm;
    delete req.query.searchFields;

    const Model = sails.models[modelName];
    if (!Model) {
      return sendError(
        makeError(
          404,
          'Model does not exist; check your request query.',
          'ModelNotFound'
        ),
        res
      );
    }
    const criteria = actionUtil.parseCriteria(req);
    delete criteria.export;
    delete criteria.sort;
    delete criteria.model;
    if (searchTerm && searchFields) {
      if (!Array.isArray(searchFields)) {
        searchFields = [searchFields];
      }
      criteria['or'] = [];
      searchFields.forEach(field => {
        const obj = {};
        obj[field] = {
          contains: searchTerm
        };
        criteria['or'].push(obj);
      });
    }
    const selectFields = (req.query.select &&
      req.query.select.split(',')) || ['*'];
    let queryData = Model.find()
      .select(selectFields)
      .where(criteria)
      .limit(actionUtil.parseLimit(req))
      .skip(actionUtil.parseSkip(req))
      .sort(actionUtil.parseSort(req));
    const queryCount = Model.count().where(criteria);
    const getTotalCount = cb => {
      queryCount.exec((err, count) => {
        console.log('TCL: ERROR::Count query::', err);
        cb(null, count);
      });
    };
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    async.parallel(
      {
        data: getData,
        count: getTotalCount
      },
      (err, results) => {
        if (err) {
          Reporting.log(err, __filename, null);
          return res.negotiate(err);
        }
        res.set('X-Total-Count', results.count);
        return res.status(200).json({
          data: results.data,
          count: results.count
        });
      }
    );

    function getData (cb) {
      if (!req.query.select) {
        // only populate if there are no select fields sent
        queryData = queryData.populateAll();
      }
      queryData.exec(function found (err, matchingRecords) {
        if (err) return res.serverError(err);

        cb(null, matchingRecords);
      });
    }
  }
};
