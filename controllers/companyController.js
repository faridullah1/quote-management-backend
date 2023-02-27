const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Company, validate } = require("../models/companyModel");
const AppError = require('../utils/appError');
const catchAsync = require("../utils/catchAsync");
const Helpers = require('../utils/helpers');

exports.getAllCompanies = async (req, res, next) => {
	const companies = await Company.findAll();

	res.status(200).json({
		status: 'success',
		data: {
			companies
		}
	});
};

exports.getCompany = async (req, res, next) => {
	const company = await Company.findByPk(req.params.id);

	if (!company) return next(new AppError('No record found with given Id', 404));

	res.status(200).json({
		status: 'success',
		data: {
			company
		}
	});
};

exports.createCompany = catchAsync(async (req, res, next) => {
	const { error } = validate(req.body);
	if (error) return next(new AppError(error.message, 400));
	
	const { email, password } = req.body;

	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(password, salt);

	const company = await Company.create({ email, password: encryptedPassword });
	
	const token = Helpers.generateAuthToken({ userId: company.companyId, email: company.email, company: true });

	res.status(201).json({
		status: 'success',
		access_token: token,
		data: {
			company
		}
	});
});

exports.deleteCompany = catchAsync(async (req, res, next) => {
	const companyId = req.params.id;
	const company = await Company.destroy({ where: { companyId }});

	if (!company) return next(new AppError('No record found with given Id', 404));

	res.status(204).json({
		status: 'success',
		data: {
			company
		}
	});
});