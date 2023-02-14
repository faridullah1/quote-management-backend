const Sequelize = require('sequelize');
const db = require('../db');
const { Company } = require('./companyModel');

const Supplier = db.define('suppliers', 
{
	supplierId: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	firstName: {
		type: Sequelize.STRING(50),
		allowNull: false,
		validate: {
			notNull: {
				msg: 'First Name is required'
			},
		}
	},
	lastName: {
		type: Sequelize.STRING(50),
		allowNull: false,
		validate: {
			notNull: {
				msg: 'Last Name is required'
			},
		}
	},
	email: {
		type: Sequelize.STRING(255),
		allowNull: false,
		unique: true,
		validate: {
			isEmail: {
				msg: 'Email is invalid'
			},
			notNull: {
				msg: 'Email is required'
			}
		}
	},
	password: {
		type: Sequelize.STRING(100),
		allowNull: false,
		validate: {
			notNull: {
				msg: 'Password is required'
			},
			len: {
                args: [8, 100],
                msg: "Password must be minimum 8 characters long"
           	}
		}
	},
	status: {
		type: Sequelize.STRING(100),
		allowNull: false,
		defaultValue: 'New'
	},
	companyId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: Company,
			key: 'companyId',
			onDelete: 'RESTRICT'
		}
	}
});

exports.Supplier = Supplier;