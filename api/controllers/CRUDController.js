const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const async = require('sails/node_modules/async');
const sendError = require('../utils/send-error');
const makeError = require('../utils/make-error');

module.exports = {
  _config: {
    actions: true,
    shortcuts: true,
    rest: true
  },
  find: function(req, res) {
    let { model: modelName, searchTerm, searchFields } = req.query;
    delete req.query.searchTerm;
    delete req.query.searchFields;
    const selectFields = (req.query.select &&
      req.query.select.split(',')) || ['*'];

    const populateFields =
      (req.query.populate && req.query.populate.split(',')) || '*';
    const disablePopulate = req.query.disablePopulate;
    delete req.query.select;
    delete req.query.populateFields;
    delete req.query.disablePopulate;

    let Model = sails.models[modelName];
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
    let criteria = actionUtil.parseCriteria(req);
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
        obj[field] = { contains: searchTerm };
        criteria['or'].push(obj);
      });
    }

    let queryData = Model.find()
      .where(criteria)
      .select(selectFields)
      .limit(actionUtil.parseLimit(req))
      .skip(actionUtil.parseSkip(req))
      .sort(actionUtil.parseSort(req));

    let queryCount = Model.count().where(criteria);
    const getTotalCount = cb => {
      queryCount.exec((_err, count) => {
        cb(null, count);
      });
    };
    const getData = cb => {
      if (!disablePopulate) {
        if (populateFields === '*') {
          queryData = queryData.populateAll();
        } else {
          populateFields.forEach(popObj => {
            queryData = queryData.populate(popObj);
          });
        }
      }
      queryData.exec((err, matchingRecords) => {
        if (err) {
          return res.serverError(err);
        }

        cb(null, matchingRecords);
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
          return res.serverError(err);
        }
        res.set('X-Total-Count', results.count);
        res.status(200).json({
          data: results.data,
          count: results.count
        });
      }
    );
  },
  findOne: function(req, res) {
    let { model: modelName, modelID: instanceID } = req.query;

    const selectFields = (req.query.select &&
      req.query.select.split(',')) || ['*'];

    const populateFields =
      (req.query.populate && req.query.populate.split(',')) || '*';
    const disablePopulate = req.query.disablePopulate;
    delete req.query.select;
    delete req.query.populateFields;
    delete req.query.disablePopulate;
    console.log('TCL: instanceID', instanceID);

    let Model = sails.models[modelName];
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
    let criteria = actionUtil.parseCriteria(req);
    delete criteria.export;
    delete criteria.sort;
    delete criteria.model;

    let queryData = Model.findOne({
      id: instanceID
    }).select(selectFields);

    if (!disablePopulate) {
      if (populateFields === '*') {
        queryData = queryData.populateAll();
      } else {
        populateFields.forEach(popObj => {
          queryData = queryData.populate(popObj);
        });
      }
    }
    queryData
      .then(result => {
        return res.status(200).json({
          data: result
        });
      })
      .catch(err =>
        sendError(
          makeError(
            404,
            err.message || 'Model not found',
            'NotFound'
          ),
          res
        )
      );
  },
  destroy: async (req, res) => {
    let { model: modelName } = req.query;
    let Model = sails.models[modelName];
    if (!Model) {
      return sendError(
        makeError(
          404,
          `Model ${modelName} does not exist; check your request query.`,
          'ModelNotFound'
        ),
        res
      );
    }
    const id = req.query.model_id;
    Model.destroyOne({ id })
      .then(instance => {
        res.status(200).json({
          message: `${modelName} with ID: ${id} deleted.`,
          instance
        });
      })
      .catch(err => {
        return sendError(makeError(400, err.message, err.name), res);
      });
  },
  create: async (req, res) => {
    let { model: modelName } = req.query;
    let Model = sails.models[modelName];
    if (!Model) {
      return sendError(
        makeError(
          404,
          `Model ${modelName} does not exist; check your request query.`,
          'ModelNotFound'
        ),
        res
      );
    }
    const formValue = req.body;
    Model.create(formValue)
      .fetch()
      .then(instance => {
        res.status(200).json({
          message: `Created ${modelName} with ID: ${instance.id}.`,
          instance
        });
      })
      .catch(err => {
        return sendError(makeError(400, err.message, err.name), res);
      });
  },
  update: async (req, res) => {
    let { model: modelName } = req.query;
    let Model = sails.models[modelName];
    if (!Model) {
      return sendError(
        makeError(
          404,
          `Model ${modelName} does not exist; check your request query.`,
          'ModelNotFound'
        ),
        res
      );
    }
    const formValue = req.body.form;
    const id = req.query.model_id;

    Model.updateOne({
      id: id
    })
      .set(formValue)
      .then(instance => {
        res.status(200).json({
          message: `Updated ${modelName} with ID: ${instance.id}.`,
          instance
        });
      })
      .catch(err => {
        return sendError(makeError(400, err.message, err.name), res);
      });
  }
};
