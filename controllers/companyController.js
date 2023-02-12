const { Company } = require("../models/companyMode");
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
	const company = await Company.create({ email, password });
	
	res.status(201).json({
		status: 'success',
		data: {
			company
		}
	});
})