/**
 * Auth.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcryptjs');
const CONSTANTS = require('../../config/constants');

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    email: {
      type: 'string',
      unique: true,
      required: true,
      isEmail: true,
      isNotEmptyString: true,
      allowNull: false
    },
    password: {
      type: 'string',
      required: true,
      minLength: 8,
      isNotEmptyString: true,
      allowNull: false
    },
    accessLevel: {
      type: 'string',
      isIn: CONSTANTS.rolesENUM,
      defaultsTo: 'customer'
    },
    verified: {
      type: 'boolean',
      defaultsTo: false
    }
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  },
  customToJSON: function() {
    // Return a shallow copy of this record with the password and ssn removed.
    return _.omit(this, ['password']);
  },
  beforeCreate: function(values, cb) {
    // Hash password
    bcrypt.hash(values.password, 10, (err, hash) => {
      if (err) return cb(err);
      values.password = hash;
      delete values.confirmation;
      cb();
    });
  }
};
