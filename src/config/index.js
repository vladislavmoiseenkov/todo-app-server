const path = require('path');

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    database: process.env.DB_NAME || 'todos',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASS || 'admin',
    options: {
      dialect: process.env.DIALECT || 'sqlite',
      host: process.env.DIALECT || 'localhost',
      storage: path.resolve(__dirname, '../../todos.sqlite'),
    },
  },
  authentacation: {
    jwtSecret: process.env.JWT_SECRET || 'secret',
  },
};
