'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('User', [
      { name: 'Juan', email: 'juan@example.com', password: '1234' },
      { name: 'Ana', email: 'ana@example.com', password: 'abcd' },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {});
  }
};
