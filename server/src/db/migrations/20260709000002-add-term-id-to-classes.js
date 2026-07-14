'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('classes', 'term_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'terms', key: 'id' },
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('classes', 'term_id');
  },
};
