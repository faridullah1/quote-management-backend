const bcrypt = require('bcrypt');

const { Company } = require("../models/companyModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllCompanies = async (req, res, next) => {
	const companies = await Company.findAll();

	res.status(200).json({
		status: 'success',
		data: {
			companies
		}
	});
};

exports.createCompany = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(password, salt);

	const company = await Company.create({ email, password: encryptedPassword });
	
	res.status(201).json({
		status: 'success',
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