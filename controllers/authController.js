// 3rd party packages
const bcrypt = require('bcrypt');
const Joi = require('joi');

// Models
const { Company } = require('../models/companyModel');

// Utils
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { Supplier } = require('../models/supplierModel');
const Helpers = require('../utils/helpers');

exports.login = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Auth']
    // #swagger.description = 'Endpoint for Sign In a user. There are 2 types of users for this application, Company and Supplier'

	const { error } = validate(req.body);
	if (error) return next(new AppError(error.message, 400));

	const model = req.body.isSupplier ? Supplier : Company;

	user = await model.findOne({ where: { email: req.body.email } });
	if (!user) return next(new AppError('Invalid email or password.', 400));

	const isValid = await bcrypt.compare(req.body.password, user.password);
	if (!isValid) return next(new AppError('Invalid email or password.', 400));

	const authTokenDetailObj = { 
		userId: req.body.isSupplier ? user.supplierId : user.companyId, 
		email: user.email,
		name: user.name,
		company: !req.body.isSupplier 
	};

	const token = Helpers.generateAuthToken(authTokenDetailObj);

	res.status(200).json({
		status: 'success',
		access_token: token
	});
});

function validate(req) {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
		isSupplier: Joi.boolean().required()
	});

	return schema.validate(req); 
}