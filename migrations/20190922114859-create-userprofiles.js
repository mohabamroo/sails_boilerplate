const tableName = 'user_profiles';
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
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: true
        },
        auth_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'auth',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        phone: { type: Sequelize.STRING, allowNull: true },
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
