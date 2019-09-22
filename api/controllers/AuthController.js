/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const validate = require('../validation/index');
const validation = require('../validation/auth.validation');
const bcrypt = require('bcryptjs');
const sendError = require('../utils/send-error');
const makeError = require('../utils/make-error');
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
  _config: {
    actions: true,
    shortcuts: true,
    rest: false
  },

  // for customer registeration only
  register: async (req, res) => {
    const fn = validationErr => {
      if (validationErr)
        return sendError({ code: 400, ...validationErr }, res);
      req.body['accessLevel'] = 'customer';
      const responseBody = {};
      Auth.create(req.body.auth)
        .fetch()
        .then(user => {
          req.body.userProfile.auth = user.id;
          return sails.helpers.jwTokenSign(user).catch(_jwtErr => {
            throw makeError(
              500,
              'Could not generate token',
              _jwtErr.name
            );
          });
        })
        .then(token => {
          responseBody['token'] = token;
          return UserProfile.create(req.body.userProfile).fetch();
        })
        .then(async userProfile => {
          res.status(201).json({ ...responseBody, userProfile });
        })
        .catch(async err => {
          // removing auth created account
          if (req.body.userProfile.auth) {
            await Auth.destroyOne({ id: req.body.userProfile.auth });
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
    const fn = validationErr => {
      if (validationErr)
        return sendError({ code: 400, ...validationErr }, res);
      const responseBody = {};
      Auth.findOne({
        email: req.body.email
      })
        .then(user => {
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
            .then(matched => {
              console.log('TCL: matched', matched);
              if (matched) {
                return new Promise(resolve => resolve(user));
              } else {
                throw makeError(
                  401,
                  'Invalid account credentials.',
                  'UnAuthorized'
                );
              }
            });
        })
        .then(result => {
          return sails.helpers.jwTokenSign(result).catch(_jwtErr => {
            throw makeError(
              500,
              'Could not generate token',
              _jwtErr.name
            );
          });
        })
        .then(token => {
          responseBody.token = token;
          return UserProfile.findOne({
            auth: responseBody.auth.id
          });
        })
        .then(userProfile => {
          // TODO: what if not verified?
          res.status(200).json({ ...responseBody, userProfile });
        })
        .catch(err => {
          return sendError({ ...err }, res);
        });
    };
    validate(validation.userLogin)(req, res, fn);
  },

  createAuthAccount: async (req, res) => {
    // to creaet any type of accounts, ADMIN level
    const fn = validationErr => {
      if (validationErr)
        return sendError({ code: 400, ...validationErr }, res);
      const authAccount = req.body.auth;
      Auth.create(authAccount)
        .fetch()
        .then(user => {
          res
            .status(201)
            .json({ message: 'Auth account created.', auth: user });
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          return sendError(
            makeError(400, err.message, err.name),
            res
          );
        });
    };
    validate(validation.createAuth)(req, res, fn);
  },

  find: async (req, res) => {
    var criteria = actionUtil.parseCriteria(req);
    var dataQuery = Auth.find()
      .where(criteria)
      .limit(actionUtil.parseLimit(req))
      .skip(actionUtil.parseSkip(req))
      .sort(actionUtil.parseSort(req))
      .populateAll();

    var countQuery = Auth.count().where(criteria);

    Promise.all([dataQuery, countQuery])
      .then(responses => {
        res.status(200).json({
          message: 'Fetched accounts',
          data: responses[0],
          count: responses[1]
        });
      })
      .catch(err =>
        sendError(makeError(400, err.message, err.name), res)
      );
  },

  update: async (req, res) => {
    const formValue = req.body;
    const id = req.params.id;

    Auth.updateOne({
      id: id
    })
      .set(formValue)
      .then(instance => {
        res.status(200).json({
          message: `Updated User with ID: ${instance.id}.`,
          instance
        });
      })
      .catch(err => {
        return sendError(makeError(400, err.message, err.name), res);
      });
  },

  destroy: async (req, res) => {
    // you cannot delete yourself.
    Auth.destroyOne({
      id: {
        '>=': req.params.id,
        '<=': req.params.id,
        '!=': req.currentUser.id
      }
    })
      .then(authAcc => {
        res
          .status(200)
          .json({ message: 'Auth account deleted.', auth: authAcc });
      })
      .catch(err => {
        return sendError(makeError(400, err.message, err.name), res);
      });
  }
};
