const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { Company } = require('../models/companyModel');

const { Supplier } = require("../models/supplierModel");
const AppError = require('../utils/appError');
const catchAsync = require("../utils/catchAsync");

exports.getAllSuppliers = async (req, res, next) => {
	// #swagger.tags = ['Supplier']
    // #swagger.description = 'Endpoint for getting all suppliers created so far. Suppliers can be filtered by firstName'

	const search = req.query;
	const where = {};

	const page = +req.query.page || 1;
	const limit = +req.query.limit || 10;

	for (let key in search) {
		if (key === 'page' || key === 'limit') continue;

		if (key === 'firstName') {
			where.firstName = {
				[Op.like]: '%' + search['firstName'] + '%'
			}
		}
	}

	where.companyId = req.user.companyId;

	const offset = (page - 1) * limit;

	const suppliers = await Supplier.findAndCountAll({
		where,
		limit,
		offset,
		include: Company 
	});

	/* #swagger.responses[200] = { 
		schema: { $ref: "#/definitions/Supplier" },
		description: 'Response will by an array of suppliers' 
	} */
	res.status(200).json({
		status: 'success',
		data: {
			suppliers
		}
	});
};

exports.getSupplier = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Supplier']
    // #swagger.description = 'Endpoint for getting supplier by its Id'

	const supplierId = req.params.id;
	const supplier = await Supplier.findByPk(supplierId);

	if (!supplier) return next(new AppError('No record found with given Id', 404));

	/* #swagger.responses[200] = { 
		schema: { $ref: "#/definitions/Supplier" },
		description: 'Supplier' 
	} */
	res.status(200).json({
		status: 'success',
		data: {
			supplier
		}
	});
});

exports.createSupplier = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Supplier']
    // #swagger.description = 'Endpoint for creating new supplier. A supplier is linked with a company'

	const { firstName, lastName, email, password, status } = req.body;
	
	if (!password) return next(new AppError('Password is required.', 400));

	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(password, salt);

	const supplier = await Supplier.create({ firstName, lastName, email, password: encryptedPassword, status, companyId: req.user.companyId });
	delete supplier.dataValues.password;
	
	res.status(201).json({
		status: 'success',
		data: {
			supplier
		}
	});
});

exports.updateSupplier = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Supplier']
    // #swagger.description = 'Endpoint for updating a supplier.'

	const supplierId = req.params.id;
	const supplier = await Supplier.update(req.body, { where: { supplierId }});

	if (!supplier) return next(new AppError('No record found with given Id', 404));

	res.status(200).json({
		status: 'success',
		data: {
			supplier
		}
	});
});

exports.deleteSupplier = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Supplier']
    // #swagger.description = 'Endpoint for deleting a supplier.'

	const supplierId = req.params.id;
	const supplier = await Supplier.destroy({ where: { supplierId }});

	if (!supplier) return next(new AppError('No record found with given Id', 404));

	res.status(204).json({
		status: 'success',
		data: {
			supplier
		}
	});
});