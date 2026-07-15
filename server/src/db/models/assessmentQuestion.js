'use strict';

module.exports = (sequelize, DataTypes) => {
  const AssessmentQuestion = sequelize.define(
    'AssessmentQuestion',
    {
      assessment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('mcq', 'true_false', 'fill_in', 'image'),
        allowNull: false,
      },
      question_text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      question_image_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      options: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      correct_answer: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      sequence_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'assessment_questions',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  AssessmentQuestion.associate = (models) => {
    AssessmentQuestion.belongsTo(models.Assessment, { foreignKey: 'assessment_id', as: 'assessment' });
  };

  return AssessmentQuestion;
};
