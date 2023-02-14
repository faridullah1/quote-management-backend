// 3rd party packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Models
const { Company } = require('../models/companyModel');

// Utils
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.login = catchAsync(async (req, res, next) => {
	const { error } = validate(req.body);
	if (error) return next(new AppError(error.message, 400));

	let user = await Company.findOne({ where: { email: req.body.email } });
	if (!user) return next(new AppError('Invalid email or password.', 400));

	const isValid = await bcrypt.compare(req.body.password, user.password);
	if (!isValid) return next(new AppError('Invalid email or password.', 400));

	const token  = jwt.sign({ userId: user.companyId, email: user.email, company: true }, process.env.JWT_PRIVATE_KEY, {
		expiresIn: process.env.JWT_EXPIRY
	});

	res.status(200).json({
		status: 'success',
		access_token: token
	});
});

function validate(req) {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	});

	return schema.validate(req); 
}