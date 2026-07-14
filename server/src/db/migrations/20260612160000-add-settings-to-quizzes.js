'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('quizzes', 'pass_mark', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 70,
    });
    await queryInterface.addColumn('quizzes', 'leaderboard_enabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('quizzes', 'pass_mark');
    await queryInterface.removeColumn('quizzes', 'leaderboard_enabled');
  },
};
