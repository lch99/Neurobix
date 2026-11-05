'use strict';

// Per-student, per-card study state for Study Set (Flashcards/Learn modes).
module.exports = (sequelize, DataTypes) => {
  const FlashcardProgress = sequelize.define(
    'FlashcardProgress',
    {
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deck_key: {
        type: DataTypes.STRING(64),
        allowNull: false,
        defaultValue: '',
      },
      card_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'new',
      },
      correct_streak: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      starred: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'flashcard_progress',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return FlashcardProgress;
};
