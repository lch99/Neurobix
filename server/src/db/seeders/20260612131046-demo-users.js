'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('users', [
      {
        role: 'admin',
        name: 'Admin User',
        email: 'admin@neurobix.com',
        username: 'admin',
        password_hash: passwordHash,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role: 'teacher',
        name: 'Sarah Tan',
        email: 'sarah.tan@neurobix.com',
        username: 'teacher1',
        password_hash: passwordHash,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role: 'student',
        name: 'Student One',
        email: 'student1@neurobix.com',
        username: 'student1',
        password_hash: passwordHash,
        level: 'P3',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role: 'parent',
        name: 'Parent One',
        email: 'parent1@neurobix.com',
        username: 'parent1',
        password_hash: passwordHash,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    const [users] = await queryInterface.sequelize.query(
      "SELECT id, username FROM users WHERE username IN ('parent1', 'student1')"
    );
    const parent = users.find((u) => u.username === 'parent1');
    const student = users.find((u) => u.username === 'student1');

    await queryInterface.bulkInsert('parent_students', [
      {
        parent_id: parent.id,
        student_id: student.id,
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE username = 'parent1'"
    );
    if (users.length) {
      await queryInterface.bulkDelete('parent_students', { parent_id: users[0].id });
    }
    await queryInterface.bulkDelete('users', {
      username: ['admin', 'teacher1', 'student1', 'parent1'],
    });
  },
};
