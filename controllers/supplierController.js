const bcrypt = require('bcrypt');
const { Company } = require('../models/companyModel');

const { Supplier } = require("../models/supplierModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllSuppliers = async (req, res, next) => {
	const suppliers = await Supplier.findAll({ include: Company });

	res.status(200).json({
		status: 'success',
		data: {
			suppliers
		}
	});
};

exports.createSupplier = catchAsync(async (req, res, next) => {
	const { firstName, lastName, email, password, status } = req.body;
	
	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(password, salt);

	const supplier = await Supplier.create({ firstName, lastName, email, password: encryptedPassword, status, companyId: req.user.companyId });
	
	res.status(201).json({
		status: 'success',
		data: {
			supplier
		}
	});
});

exports.deleteSupplier = catchAsync(async (req, res, next) => {
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