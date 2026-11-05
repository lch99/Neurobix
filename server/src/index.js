'use strict';

require('dotenv').config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change_me') {
  if (process.env.NODE_ENV === 'production') {
    console.error('JWT_SECRET must be set to a long random value in production.');
    process.exit(1);
  }
  console.warn('[warn] JWT_SECRET is not set (or still "change_me") — fine for local dev only.');
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev_only_insecure_secret';
}

const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
