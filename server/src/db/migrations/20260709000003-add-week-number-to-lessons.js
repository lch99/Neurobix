'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('lessons', 'week_number', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Week within the class term that this lesson is scheduled for',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('lessons', 'week_number');
  },
};
