/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const validate = require('../validation/index');
const validation = require('../validation/user.validation');
const bcrypt = require('bcryptjs');
const sendError = require('../utils/send-error');
const makeError = require('../utils/make-error');
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

const generateToken = (user) => {
  return sails.helpers.jwTokenSign(user).catch((_jwtErr) => {
    console.error('generateToken -> _jwtErr', _jwtErr);
    throw makeError(500, 'Could not generate token', _jwtErr.name);
  });
};
module.exports = {
  _config: {
    actions: true,
    shortcuts: true,
    rest: false
  },

  // for customer registeration only
  register: async (req, res) => {
    const fn = (validationErr) => {
      if (validationErr)
        return sendError({ code: 400, ...validationErr }, res);
      req.body['accessLevel'] = 'parent';
      const responseBody = {};
      User.create(req.body)
        .fetch()
        .then((user) => {
          req.body.user = user.id;
          return generateToken(user);
        })
        .then((token) => {
          responseBody['token'] = token;
        })
        .then(async () => {
          return res.status(201).json({ ...responseBody });
        })
        .catch(async (err) => {
          // removing auth created account
          if (req.body.user) {
            await User.destroyOne({ id: req.body.user });
          }
          return sendError(
            makeError(400, err.message, err.name),
            res
          );
        });
    };
    validate(validation.userRegister)(req, res, fn);
  },

  login: async (req, res) => {
    const fn = (validationErr) => {
      if (validationErr)
        return sendError({ code: 400, ...validationErr }, res);
      const responseBody = {};
      User.findOne({
        email: req.body.email
      })
        .then((user) => {
          if (!user) {
            throw makeError(
              404,
              'User account not found.',
              'ModelNotFound'
            );
          }
          responseBody.auth = user.toJSON();
          return bcrypt
            .compare(req.body.password, user.password)
            .then((matched) => {
              console.log('TCL: matched', matched);
              if (matched) {
                return new Promise((resolve) => resolve(user));
              } else {
                throw makeError(
                  401,
                  'Invalid account credentials.',
                  'UnAuthorized'
                );
              }
            });
        })
        .then((result) => {
          return generateToken(result);
        })
        .then((token) => {
          responseBody.token = token;
        })
        .then((userProfile) => {
          // TODO: what if not verified?
          return res.status(200).json({ ...responseBody });
        })
        .catch((err) => {
          return sendError({ ...err }, res);
        });
    };
    validate(validation.userLogin)(req, res, fn);
  },

  find: async (req, res) => {
    const criteria = actionUtil.parseCriteria(req);
    const dataQuery = User.find()
      .where(criteria)
      .limit(actionUtil.parseLimit(req))
      .skip(actionUtil.parseSkip(req))
      .sort(actionUtil.parseSort(req))
      .populateAll();

    const countQuery = User.count().where(criteria);

    Promise.all([dataQuery, countQuery])
      .then((responses) => {
        return res.status(200).json({
          message: 'Fetched accounts',
          data: responses[0],
          count: responses[1]
        });
      })
      .catch((err) =>
        sendError(makeError(400, err.message, err.name), res)
      );
  },

  update: async (req, res) => {
    const formValue = req.body;
    const id = req.params.id;

    User.updateOne({
      id: id
    })
      .set(formValue)
      .then((instance) => {
        return res.status(200).json({
          message: `Updated User with ID: ${instance.id}.`,
          instance
        });
      })
      .catch((err) => {
        return sendError(makeError(400, err.message, err.name), res);
      });
  },

  destroy: async (req, res) => {
    // you cannot delete yourself.
    User.destroyOne({
      id: {
        '>=': req.params.id,
        '<=': req.params.id,
        '!=': req.currentUser.id
      }
    })
      .then((authAcc) => {
        return res
          .status(200)
          .json({ message: 'Auth account deleted.', auth: authAcc });
      })
      .catch((err) => {
        return sendError(makeError(400, err.message, err.name), res);
      });
  }
};
