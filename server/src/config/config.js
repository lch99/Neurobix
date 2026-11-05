require('dotenv').config();

const base = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'neurobix_lms',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
};

module.exports = {
  development: base,
  test: { ...base, database: process.env.DB_NAME_TEST || `${base.database}_test` },
  // Production reads DATABASE_URL when it is set (e.g. managed MySQL), else the DB_* vars.
  production: process.env.DATABASE_URL ? { ...base, use_env_variable: 'DATABASE_URL' } : base,
};
