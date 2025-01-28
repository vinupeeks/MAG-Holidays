require('dotenv').config();

module.exports = {
  HOST: process.env.SQLHOST ,
  USER: process.env.SQLUSER ,
  PASSWORD: process.env.SQLPASSWORD ,
  DB: process.env.SQLDB ,
  dialect: process.env.SQLDIAL,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};