const Sequelize = require('sequelize');

const env = process.env.NODE_ENV;
let db = process.env.DATABASE;

if (env === 'test') {
	db = process.env.DATABASE_TEST;
}

const connection = new Sequelize(db, process.env.USER, process.env.PASSWORD, {
	dialect: 'postgres',
	host: process.env.HOST,
});

module.exports = connection;