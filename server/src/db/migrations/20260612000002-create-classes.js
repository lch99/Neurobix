'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('classes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      level: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: 'P1-P6',
      },
      type: {
        type: Sequelize.ENUM('regular', 'extra'),
        allowNull: false,
        defaultValue: 'regular',
        comment: 'regular = sequential lessons, extra = open enrolment, any order',
      },
      teacher_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      leaderboard_enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'archived'),
        allowNull: false,
        defaultValue: 'active',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('class_enrollments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'classes', key: 'id' },
        onDelete: 'CASCADE',
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      enrolled_by: {
        type: Sequelize.ENUM('admin', 'self'),
        allowNull: false,
        defaultValue: 'admin',
      },
      status: {
        type: Sequelize.ENUM('active', 'dropped'),
        allowNull: false,
        defaultValue: 'active',
      },
      enrolled_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('class_enrollments', {
      fields: ['class_id', 'student_id'],
      type: 'unique',
      name: 'uk_class_student',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('class_enrollments');
    await queryInterface.dropTable('classes');
  },
};
