'use strict';

module.exports = (sequelize, DataTypes) => {
  const ClassEnrollment = sequelize.define(
    'ClassEnrollment',
    {
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      enrolled_by: {
        type: DataTypes.ENUM('admin', 'self'),
        allowNull: false,
        defaultValue: 'admin',
      },
      status: {
        type: DataTypes.ENUM('active', 'dropped'),
        allowNull: false,
        defaultValue: 'active',
      },
      enrolled_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'class_enrollments',
      underscored: true,
      timestamps: false,
    }
  );

  ClassEnrollment.associate = (models) => {
    ClassEnrollment.belongsTo(models.Class, { foreignKey: 'class_id', as: 'class' });
    ClassEnrollment.belongsTo(models.User, { foreignKey: 'student_id', as: 'student' });
  };

  return ClassEnrollment;
};
