const Sequelize = require('sequelize');

const env = process.env.NODE_ENV;
const db = env === 'test' ? process.env.DATABASE_TEST : process.env.DATABASE;
const logging = env === 'development';

const connection = new Sequelize(db, process.env.USER, process.env.PASSWORD, {
	dialect: 'postgres',
	host: process.env.HOST,
	logging
});

module.exports = connection;