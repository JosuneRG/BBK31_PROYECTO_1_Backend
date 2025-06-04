'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('productcategory', [
      { product_id: 1, category_id: 1 },
      { product_id: 2, category_id: 2 }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('productcategory', null, {});
  }
};
