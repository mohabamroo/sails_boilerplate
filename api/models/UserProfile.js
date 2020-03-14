/**
 * UserProfile.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const CONSTANTS = require('../../config/constants');
module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    address: {
      type: 'string',
      required: true
    },
    countryCode: {
      type: 'string',
      required: true
    },
    phone: {
      type: 'string',
      required: true
    },
    birthDate: {
      type: 'ref',
      columnType: 'datetime'
    },
    gender: {
      type: 'string',
      isIn: CONSTANTS.genders
    },
    countryCode: {
      type: 'string',
      allowNull: true,
      columnName: 'country_code'
    },
    profileImg: {
      type: 'string',
      allowNull: true,
      columnName: 'profile_img'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    auth: {
      model: 'auth',
      required: true,
      unique: true,
      columnName: 'auth_id'
    }
  },
  customToJSON: function () {
    this.name = this.firstName + ' ' + (this.lastName || '');
    if (this.birthDate) {
      this.age = Math.abs(
        moment(this.birthDate).diff(moment(), 'years')
      );
    }
    return _.omit(this, []);
  },
  tableName: 'user_profiles'
};
