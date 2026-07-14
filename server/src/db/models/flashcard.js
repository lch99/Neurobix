'use strict';

module.exports = (sequelize, DataTypes) => {
  const Flashcard = sequelize.define(
    'Flashcard',
    {
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      owner_student_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      front_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      front_image_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      back_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      back_image_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      hint: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sequence_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'flashcards',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Flashcard.associate = (models) => {
    Flashcard.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' });
  };

  return Flashcard;
};
