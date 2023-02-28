const Sequelize = require('sequelize');
const db = require('../db');
const { Company } = require('./companyModel');

const Quote = db.define('quotes', 
{
	quoteId: {
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
				msg: 'Quote name is required'
			},
			notEmpty: {
				msg: 'Quote name is required'
			}
		}
	},
	startDate: {
		type: Sequelize.DATE,
		allowNull: false,
		validate: {
			notNull: {
				msg: 'Start Date is required'
			},
		}
	},
	endDate: {
		type: Sequelize.DATE,
		allowNull: false,
		validate: {
			notNull: {
				msg: 'End Date is required'
			},
		}
	},
	status: {
		type: Sequelize.STRING(50),
		allowNull: false,
		defaultValue: 'Draft'
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

exports.Quote = Quote;