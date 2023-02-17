const { QuoteItem } = require("../models/quoteItemModel");
const catchAsync = require("../utils/catchAsync");

exports.createQouteItem = catchAsync(async (req, res, next) => {
	const { name, quantity, price, quoteId } = req.body;

	const item = await QuoteItem.create({ name, quantity, price, quoteId });
	
	res.status(201).json({
		status: 'success',
		data: {
			item
		}
	});
});

exports.deleteQuoteItem = catchAsync(async (req, res, next) => {
	const itemId = req.params.id;
	const item = await QuoteItem.destroy({ where: { itemId }});

	if (!item) return next(new AppError('No record found with given Id', 404));

	res.status(204).json({
		status: 'success',
		data: {
			item
		}
	});
});