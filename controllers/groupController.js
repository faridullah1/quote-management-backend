const { Group } = require('../models/groupsModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllGroups = catchAsync(async (req, res, next) => {
	const groups = await Group.findAll({ where: { companyId: req.user.companyId }});

	res.status(200).json({
		status: 'success',
		data: {
			groups
		}
	});
});

exports.createGroup = catchAsync(async (req, res, nex) => {
	const { name } = req.body;

	const group = await Group.create({ name, companyId: req.user.companyId });
	
	res.status(201).json({
		status: 'success',
		data: {
			group
		}
	});
});