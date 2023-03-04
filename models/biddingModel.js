const Sequelize = require('sequelize');
const db = require('../db');
const { QuoteItem } = require('./quoteItemModel');
const { Supplier } = require('./supplierModel');

const Bidding = db.define('bidding', 
{
	biddingId: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	price: {
		type: Sequelize.FLOAT,
		allowNull: false,
		validate: {
			notNull: {
				msg: 'price is required'
			}
		}
	},
	amount: {
		type: Sequelize.FLOAT,
		allowNull: false,
		validate: {
			notNull: {
				msg: 'amount is required'
			}
		}
	},
	deliveryTime: {
		type: Sequelize.DATE,
		allowNull: false,
		validate: {
			notNull: {
				msg: 'delivery time is required'
			}
		}
	},
	deliveryTimeUnit: {
		type: Sequelize.ENUM('Days', 'Weeks'),
		allowNull: false,
		defaultValue: 'Days'
	},
	isBidIgnored: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},
	comments: Sequelize.STRING(1000),
	supplierId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: Supplier,
			key: 'supplierId',
			onDelete: 'RESTRICT'
		}
	},
	itemId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: QuoteItem,
			key: 'itemId',
			onDelete: 'RESTRICT'
		}
	}
});

exports.Bidding = Bidding;