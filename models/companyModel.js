const Sequelize = require('sequelize');
const Joi = require('joi');
const db = require('../db');

const Company = db.define('companies', 
{
	companyId: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
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
	}
});

function validateCompany(company) {
	const schema = Joi.object({
		email: Joi.string().required().email(),
		password: Joi.string().required().min(8).max(50),
	});

	return schema.validate(company);
}

exports.validate = validateCompany;
exports.Company = Company;