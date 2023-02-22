const { Group } = require("../models/groupsModel");
const { QuoteItem } = require("../models/quoteItemModel");
const { Quote } = require("../models/quoteModel");
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

	for (let item of quote_items) {
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