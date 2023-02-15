const Sequelize = require('sequelize');
const db = require('../db');
const { Group } = require('./groupsModel');
const { Supplier } = require('./supplierModel');

const SupplierGroupDetail = db.define('supplier_group_detail', 
{
	groupId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: Group,
			key: 'groupId',
			onDelete: 'RESTRICT'
		},
		primaryKey: true
	},
	supplierId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: Supplier,
			key: 'supplierId',
			onDelete: 'RESTRICT'
		},
		primaryKey: true
	}
});

exports.SupplierGroupDetail = SupplierGroupDetail;