const { Op } = require('sequelize');
const { Group } = require('../models/groupsModel');
const { SupplierGroupDetail } = require('../models/supplierGroupDetailModel');
const { Supplier } = require('../models/supplierModel');
const AppError = require('../utils/appError');
const catchAsync = require("../utils/catchAsync");

exports.getAllSupplierGroupDetail = async (req, res, next) => {
	const search = req.query;
	const where = {};

	const page = +req.query.page || 1;
	const limit = +req.query.limit || 10;

	for (let key in search) {
		if (key === 'page' || key === 'limit') continue;

		if (key === 'name') {
			where.name = {
				[Op.like]: '%' + search['name'] + '%'
			}
		}
	}

	where.companyId = req.user.companyId;

	const offset = (page - 1) * limit;

	const groups = await Group.findAndCountAll({
		where,
		offset,
		limit
	});

	const records = groups.rows.map(group => group.dataValues)
	const supplierGroups = [];

	for (let rec of records) {
		const supplierGroup = {
			groupName: rec.name,
			groupId: rec.groupId,
			suppliers: []
		};

		const suppliers = await SupplierGroupDetail.findAll({
			where: { groupId: rec.groupId },
			include: Supplier
		});

		supplierGroup.suppliers = suppliers;
		supplierGroups.push(supplierGroup);
	}

	res.status(200).json({
		status: 'success',
		totalRecords: groups.count,
		data: {
			supplierGroups
		}
	});
};

exports.getGroup = catchAsync(async (req, res, next) => {
	const groupId = req.params.id;
	const group = await Group.findByPk(groupId);

	if (!group) return next(new AppError('No record found with given Id', 404));

	const supplierGroup = {
		groupName: group.name,
		groupId: group.groupId,
		suppliers: []
	};

	supplierGroup.suppliers = await SupplierGroupDetail.findAll({
		where: { groupId: group.groupId },
		include: Supplier
	});

	res.status(200).json({
		status: 'success',
		data: {
			supplierGroup
		}
	});
});

exports.createGroup = catchAsync(async (req, res, next) => {
	const { name, suppliers } = req.body;

	const allSuppliers = suppliers || [];

	const group = await Group.create({ name, companyId: req.user.companyId });

	for (let supplierId of allSuppliers) {
		await SupplierGroupDetail.create({ groupId: group.dataValues.groupId, supplierId })
	}
	
	res.status(201).json({
		status: 'success',
		data: {
			group
		}
	});
});

exports.updateGroup = catchAsync(async (req, res, next) => {
	const { name, suppliers } = req.body;
	const groupId = req.params.id;
	const group = await Group.findByPk(groupId);

	if (!group) return next(new AppError('No supplier group found with given Id', 404));

	if (name) {
		group.name = name;
		await group.save();
	}
	if (suppliers && suppliers.length > 0) {
		await SupplierGroupDetail.destroy({ where: { groupId }});

		for (let supplierId of suppliers) {
			await SupplierGroupDetail.create({ groupId, supplierId })
		}
	}

	res.status(200).json({
		status: 'success',
		data: {
			group
		}
	});
});

exports.deleteGroup = catchAsync(async (req, res, next) => {
	const groupId = req.params.id;
	const group = await Group.destroy({ where: { groupId }});

	if (!group) return next(new AppError('No record found with given Id', 404));

	await SupplierGroupDetail.destroy({ where: { groupId }});

	res.status(204).json({
		status: 'success',
		data: {
			group
		}
	});
});