'use strict';

module.exports = (sequelize, DataTypes) => {
  const QuizCard = sequelize.define(
    'QuizCard',
    {
      quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      sequence_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'quiz_cards',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  QuizCard.associate = (models) => {
    QuizCard.belongsTo(models.Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
  };

  return QuizCard;
};
