const { Group } = require('../models/groupsModel');

exports.getAllGroups = async (req, res, next) => {
	const groups = await Group.findAll({ where: { companyId: req.user.companyId }});

	res.status(200).json({
		status: 'success',
		data: {
			groups
		}
	});
};