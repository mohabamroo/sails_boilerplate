const tableName = 'auth';
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
          defaultValue: 'customer'
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
