'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('student_points', {
      student_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      total_points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('points_ledger', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reason: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      ref_type: {
        type: Sequelize.STRING(30),
        allowNull: true,
        comment: 'e.g. lesson, quiz, badge',
      },
      ref_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('points_ledger', ['student_id'], {
      name: 'idx_points_ledger_student',
    });

    await queryInterface.createTable('badges', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      icon_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      criteria_type: {
        type: Sequelize.STRING(30),
        allowNull: true,
        comment: 'e.g. lessons_completed, points_total, streak_days',
      },
      criteria_value: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('student_badges', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      badge_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'badges', key: 'id' },
        onDelete: 'CASCADE',
      },
      earned_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('student_badges', {
      fields: ['student_id', 'badge_id'],
      type: 'unique',
      name: 'uk_student_badge',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('student_badges');
    await queryInterface.dropTable('badges');
    await queryInterface.dropTable('points_ledger');
    await queryInterface.dropTable('student_points');
  },
};
