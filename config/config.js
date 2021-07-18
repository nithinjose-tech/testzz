const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  development: {
    username: process.env.name,
    password: process.env.password,
    database: process.env.database,
    host: process.env.host,
    port: process.env.port,
    dialect: process.env.dialect,
  },
  test: {
    username: process.env.name,
    password: process.env.password,
    database: process.env.database1,
    host: process.env.host,
    port: process.env.port,
    dialect: process.env.dialect,
  },
  production: {
    username: process.env.name,
    password: process.env.password,
    database: process.env.database2,
    host: process.env.host,
    port: process.env.port,
    dialect: process.env.dialect,
  },
};
