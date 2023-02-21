const Sequelize = require('sequelize');
const db = require('../db');
const { Company } = require('./companyModel');
const { Group } = require('./groupsModel');
const { Quote } = require('./quoteModel');

const QuoteItem = db.define('quote_items', 
{
	itemId: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING(255),
		allowNull: false,
		validate: {
			notNull: {
				msg: 'Item name is required'
			},
		}
	},
	quantity: {
		type: Sequelize.FLOAT,
		allowNull: false,
		validate: {
			notNull: {
				msg: 'Quantity is required'
			},
		}
	},
	price: {
		type: Sequelize.FLOAT,
		allowNull: false,
		validate: {
			notNull: {
				msg: 'Price is required'
			},
		}
	},
	quoteId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: Quote,
			key: 'quoteId',
			onDelete: 'RESTRICT'
		}
	},
	groupId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: Group,
			key: 'groupId',
			onDelete: 'RESTRICT'
		}
	}
});

exports.QuoteItem = QuoteItem;