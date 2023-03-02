const { QuoteItem } = require("../models/quoteItemModel");
const catchAsync = require("../utils/catchAsync");

exports.createQouteItem = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Quote Item']
    // #swagger.description = 'Endpoint for create a new quote item. Each quote item is attached with supplier group. Only suppliers which belongs to that group can bid on this item.'
	
	const { name, quantity, price, quoteId, groupId } = req.body;

	const item = await QuoteItem.create({ name, quantity, price, quoteId, groupId });
	
	res.status(201).json({
		status: 'success',
		data: {
			item
		}
	});
});

exports.deleteQuoteItem = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Quote Item']
    // #swagger.description = 'Endpoint for deleting a quote by its Id'

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