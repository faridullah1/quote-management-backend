// Built in packages
const { promisify } = require('util');

// 3rd party packages
const jwt = require('jsonwebtoken');

// Models
const { Company } = require('../models/companyModel');
const { Supplier } = require('../models/supplierModel');

// Utils
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.auth = catchAsync(async (req, res, next) => {
	// 1) Getting token and checking if it is there;
	let token = '';
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(new AppError('Access denied. No token provided..', 401));
	}

	// 2) Token verification;
	let decoded;
	decoded = await promisify(jwt.verify)(token, process.env.JWT_PRIVATE_KEY);

	// 3) Check if user still exists;
	if (decoded) {
		let currentUser = await Company.findByPk(decoded.userId);

		if (currentUser == null) {
			currentUser =  await Supplier.findByPk(decoded.userId);
		}

		if (!currentUser) {
			return next(new AppError('The user belongs to the token does no longer exists.', 401));
		}

		req.user = currentUser.dataValues;
	}
	
	// Grant access to protected route;
	next();
});