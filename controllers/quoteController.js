const { Op } = require("sequelize");
const { Bidding } = require("../models/biddingModel");
const { Group } = require("../models/groupsModel");
const { QuoteItem } = require("../models/quoteItemModel");
const { Quote } = require("../models/quoteModel");
const { SupplierGroupDetail } = require("../models/supplierGroupDetailModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getSupplierGroups = async (supplierId) => {
	// Get all groups where supplier exists
	const supplierGroups = await SupplierGroupDetail.findAll({
		where: { supplierId },
		attributes: ['groupId']
	});

	// Prepare array which will contain only group ids
	const groupIds = supplierGroups.map(g => g.dataValues.groupId);

	return groupIds;
}

exports.getAllQuotes = async (req, res, next) => {
	// #swagger.tags = ['Quote']
    // #swagger.description = 'Endpoint for getting all quotes created so far.'

	const where = { companyId: req.user.companyId };

	const name = req.query.name;
	if (name) {
		where.name = {
			[Op.like]: '%' + name + '%'
		}
	}

	const quotes = await Quote.findAll({ where });

	/* #swagger.responses[200] = { 
		schema: { $ref: "#/definitions/Quote" },
		description: 'Response will by an array of Quotes' 
	} */
	res.status(200).json({
		status: 'success',
		data: {
			quotes
		}
	});
};

exports.getAllReleasedQuotesBySupplier = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Quote']
    // #swagger.description = 'Endpoint for getting all RELEASED quotes created so far. Supplier can only bid on quote which is released.'

	// Only Supplier can perform this action
	if (!req.user.supplierId) return next(new AppError("You don't have the permission to perform the action", 403));

	// Get groupIds where supplier exists
	const groupIds = await getSupplierGroups(req.user.supplierId)

	/* Get all those quotes whose 
		1. status is RELEASED
		2. its items must be linked with groups in which current logged in supplier exists
	*/
	const quotes = await Quote.findAll({
		where: { status: 'Released' },
		include: {
			model: QuoteItem,
			required: true,

			include: {
				model: Group,
				where: { groupId: {
					[Op.in]: groupIds
				}}
			}
		}
	});

	res.status(200).json({
		status: 'success',
		data: {
			quotes
		}
	});
});

exports.getQuote = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Quote']
    // #swagger.description = 'Endpoint for getting a single quote by its Id. If supplier is logged In, then this API will give quote along with items and bidding info. If Company user is logged In, then this endpoint give quote with its items only.'

	const quoteId = req.params.id;
	let groupIds = [];
	let quote;

	if (req.user.supplierId) {
		groupIds = await getSupplierGroups(req.user.supplierId);
	}

	if (groupIds.length > 0) {
		quote = await Quote.findByPk(quoteId, {
			include: {
				model: QuoteItem,
				include:  [
					{
						model: Group,
						where: { groupId: {
							[Op.in]: groupIds
						}}
					},
					{
						model: Bidding,
						where: {
							supplierId: req.user.supplierId
						},
						required: false
					}
				]
			}
		});
	}
	else {
		quote = await Quote.findByPk(quoteId, {
			include: {
				model: QuoteItem,
				include:  Group
			}
		});
	}

	if (!quote) return next(new AppError('No record found with given Id', 404));

	res.status(200).json({
		status: 'success',
		data: {
			quote
		}
	});
});

exports.createQuote = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Quote']
    // #swagger.description = 'Endpoint for creating a new quote. A quote is always created by a company. If quote items are provided to this endpoint then it will also attach them to quote'

	const { name, startDate, endDate, status, quote_items } = req.body;

	const quote = await Quote.create({ name, startDate, endDate, status, companyId: req.user.companyId });

	const items = quote_items || [];

	// Check if there is any quote item without group
	for (let item of items) {
		if (!item.groupId) {
			await Quote.destroy({ where: { quoteId: quote.dataValues.quoteId }});
			return next(new AppError(`"${item.name}" is not linked to a group`, 400));
		}
	}

	for (let item of items) {
		const newQuoteItem = { ...item, quoteId: quote.dataValues.quoteId }
		await QuoteItem.create(newQuoteItem);
	}
	
	res.status(201).json({
		status: 'success',
		data: {
			quote
		}
	});
});

exports.updateQuote = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Quote']
    // #swagger.description = 'Endpoint for updating quote by its Id.'

	const quoteId = req.params.id;
	const quote = await Quote.update(req.body, { where: { quoteId }});

	if (req.body.quote_items) {
		const { quote_items } = req.body;
		
		for (let item of quote_items) {
			if (!item.groupId) {
				return next(new AppError(`"${item.name}" is not linked to a group`, 400));
			}

			await QuoteItem.upsert(item, { itemId: item.itemId });
		}
	}

	if (!quote) return next(new AppError('No record found with given Id', 404));

	res.status(200).json({
		status: 'success',
		data: {
			quote
		}
	});
});

exports.deleteQuote = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Quote']
    // #swagger.description = 'Endpoint for deleting quote by its Id.'

	const quoteId = req.params.id;

	// First delete all quote items with the given quote id;
	await QuoteItem.destroy({ where: { quoteId }});

	const quote = await Quote.destroy({ where: { quoteId }});
	if (!quote) return next(new AppError('No record found with given Id', 404));

	res.status(204).json({
		status: 'success',
		data: {
			quote
		}
	});
});