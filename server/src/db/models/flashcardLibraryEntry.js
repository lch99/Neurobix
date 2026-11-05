'use strict';

// A card a student saved into their own private library. Text is copied from the source
// card so the saved copy survives the teacher editing or deleting the original.
module.exports = (sequelize, DataTypes) => {
  const FlashcardLibraryEntry = sequelize.define(
    'FlashcardLibraryEntry',
    {
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      flashcard_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      front_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      back_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      hint: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'flashcard_library',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return FlashcardLibraryEntry;
};
