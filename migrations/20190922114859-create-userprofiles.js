const tableName = 'users';
const CONSTANTS = require('../config/constants');

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      tableName,
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true
        },

        password: {
          type: Sequelize.STRING,
          unique: false,
          allowNull: false
        },
        verified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        accessLevel: {
          type: Sequelize.ENUM({ values: CONSTANTS.rolesENUM }),
          allowNull: false,
          defaultValue: 'parent'
        },

        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: true
        },
        address: { type: Sequelize.STRING, allowNull: true },
        countryCode: {
          type: Sequelize.STRING
        },
        gender: Sequelize.ENUM({ values: CONSTANTS.genders }),
        birthdate: {
          type: Sequelize.DATEONLY,
          defaultValue: null
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        deletedAt: { type: Sequelize.DATE, defaultValue: null }
      },
      {
        engine: 'INNODB'
      }
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable(tableName)
};
