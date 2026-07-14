'use strict';

module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define(
    'Class',
    {
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      level: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM('regular', 'extra'),
        allowNull: false,
        defaultValue: 'regular',
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      term_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      leaderboard_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'archived'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      tableName: 'classes',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Class.associate = (models) => {
    Class.belongsTo(models.User, { foreignKey: 'teacher_id', as: 'teacher' });
    Class.belongsTo(models.Term, { foreignKey: 'term_id', as: 'term' });
    Class.hasMany(models.Lesson, { foreignKey: 'class_id', as: 'lessons' });
    Class.hasMany(models.ClassEnrollment, { foreignKey: 'class_id', as: 'enrollments' });
  };

  return Class;
};
