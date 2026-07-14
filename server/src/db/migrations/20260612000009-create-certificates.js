'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('certificates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      certificate_no: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'classes', key: 'id' },
        onDelete: 'CASCADE',
      },
      pdf_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      issued_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('certificates', {
      fields: ['student_id', 'class_id'],
      type: 'unique',
      name: 'uk_certificate_student_class',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('certificates');
  },
};
