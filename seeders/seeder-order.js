'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Order', [
      { user_id: 1, order_date: new Date(), total: 1019.98, status: 'pending' },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Order', null, {});
  }
};
