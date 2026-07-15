'use strict';

module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define(
    'Lesson',
    {
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('video', 'flashcard', 'assessment', 'reading', 'activity'),
        allowNull: false,
      },
      sequence_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      week_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      difficulty: {
        type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
        allowNull: true,
      },
      duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      video_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      reading_content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'draft',
      },
    },
    {
      tableName: 'lessons',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Lesson.associate = (models) => {
    Lesson.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class' });
    Lesson.hasMany(models.Flashcard, { foreignKey: 'lesson_id', as: 'flashcards' });
    Lesson.hasOne(models.Assessment, { foreignKey: 'lesson_id', as: 'assessment' });
    Lesson.hasOne(models.Schedule, { foreignKey: 'lesson_id', as: 'schedule' });
  };

  return Lesson;
};
