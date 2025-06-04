'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Category', [
      { name: 'Electronics', description: 'Gadgets and devices' },
      { name: 'Clothing', description: 'Apparel and accessories' }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Category', null, {});
  }
};
