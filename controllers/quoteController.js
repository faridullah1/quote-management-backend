const { Op } = require("sequelize");
const { Group } = require("../models/groupsModel");
const { QuoteItem } = require("../models/quoteItemModel");
const { Quote } = require("../models/quoteModel");
const { SupplierGroupDetail } = require("../models/supplierGroupDetailModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllQuotes = async (req, res, next) => {
	const quotes = await Quote.findAll({ 
		where: { companyId: req.user.companyId },
		include: {
			model: QuoteItem,
			include: Group
		}
	});

	res.status(200).json({
		status: 'success',
		data: {
			quotes
		}
	});
};

exports.getAllReleasedQuotesBySupplier = catchAsync(async (req, res, next) => {
	// Only Supplier can perform this action
	if (!req.user.supplierId) return next(new AppError("You don't have the permission to perform the action", 403));

	// Get all groups where the current logged in supplier exists
	const supplierGroups = await SupplierGroupDetail.findAll({
		where: { supplierId: req.user.supplierId },
		attributes: ['groupId']
	});

	// Prepare array which will contain only group ids
	const groupIds = supplierGroups.map(g => g.dataValues.groupId);

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
	const quoteId = req.params.id;
	const quote = await Quote.findByPk(quoteId, {
		include: {
			model: QuoteItem,
			include:  Group
		}
	});

	if (!quote) return next(new AppError('No record found with given Id', 404));

	res.status(200).json({
		status: 'success',
		data: {
			quote
		}
	});
});

exports.createQuote = catchAsync(async (req, res, next) => {
	const { name, startDate, endDate, status, quote_items } = req.body;

	const quote = await Quote.create({ name, startDate, endDate, status, companyId: req.user.companyId });

	const items = quote_items || [];

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
	const quoteId = req.params.id;
	const quote = await Quote.update(req.body, { where: { quoteId }});

	if (req.body.quote_items) {
		const { quote_items } = req.body;
		
		for (let item of quote_items) {
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