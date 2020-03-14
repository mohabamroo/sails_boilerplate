'use strict';
const tableName = 'user_profiles';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let migrations = [];

    migrations.push(
      queryInterface.addColumn(tableName, 'country_code', {
        type: Sequelize.STRING,
        allowNull: true
      })
    );

    migrations.push(
      queryInterface.addColumn(tableName, 'profile_img', {
        type: Sequelize.STRING,
        allowNull: true
      })
    );

    return Promise.all(migrations);
  },
  down: (queryInterface, Sequelize) => {
    let migrations = [];
    migrations.push(
      queryInterface.removeColumn(tableName, 'profile_img')
    );
    migrations.push(
      queryInterface.removeColumn(tableName, 'country_code')
    );

    return Promise.all(migrations);
  }
};
