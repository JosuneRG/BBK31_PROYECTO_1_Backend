'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orderproduct', [
      { order_id: 1, product_id: 1, quantity: 1, price: 999.99 },
      { order_id: 1, product_id: 2, quantity: 1, price: 19.99 }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orderproduct', null, {});
  }
};
