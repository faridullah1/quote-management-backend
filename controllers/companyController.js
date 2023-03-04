const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Company, validate } = require("../models/companyModel");
const AppError = require('../utils/appError');
const catchAsync = require("../utils/catchAsync");
const Helpers = require('../utils/helpers');

exports.getAllCompanies = async (req, res, next) => {
	// #swagger.tags = ['Company']
    // #swagger.description = 'Endpoint for getting all companies created so far.'

	const companies = await Company.findAll();

	/* #swagger.responses[200] = { 
		schema: { $ref: "#/definitions/Company" },
		description: 'Response will by an array of companies' 
	} */
	res.status(200).json({
		status: 'success',
		data: {
			companies
		}
	});
};

exports.getCompany = async (req, res, next) => {
	// #swagger.tags = ['Company']
    // #swagger.description = 'Endpoint for getting company by its primary key.'

	const company = await Company.findByPk(req.params.id);

	if (!company) return next(new AppError('No record found with given Id', 404));

	/* #swagger.responses[200] = { 
		schema: { $ref: "#/definitions/Company" },
		description: 'Response will by an array of companies' 
	} */
	res.status(200).json({
		status: 'success',
		data: {
			company
		}
	});
};

exports.createCompany = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Company']
    // #swagger.description = 'Endpoint for creating a new company.'

	const { error } = validate(req.body);
	if (error) return next(new AppError(error.message, 400));
	
	const { email, password } = req.body;

	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(password, salt);

	let company = await Company.create({ email, password: encryptedPassword });
	delete company.dataValues.password;
		
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
	// #swagger.tags = ['Company']
    // #swagger.description = 'Endpoint for deleting a company by its Id.'

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