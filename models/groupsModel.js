const Sequelize = require('sequelize');
const db = require('../db');
const { Company } = require('./companyModel');

const Group = db.define('groups', 
{
	groupId: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING(50),
		allowNull: false,
		validate: {
			notNull: {
				msg: 'Group name is required'
			},
			notEmpty: {
				msg: 'Group name is required'
			}
		}
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

exports.Group = Group;