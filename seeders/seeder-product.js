'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Product', [
      { name: 'Laptop', description: 'A powerful laptop', price: 999.99, stock: 10, category_id: 1 },
      { name: 'T-Shirt', description: 'Cotton t-shirt', price: 19.99, stock: 100, category_id: 2 }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Product', null, {});
  }
};
