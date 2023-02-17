const { Quote } = require("../models/quoteModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllQuotes = async (req, res, next) => {
	const quotes = await Quote.findAll({ 
		where: { companyId: req.user.companyId } 
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
	const quote = await Quote.findByPk(quoteId);

	if (!quote) return next(new AppError('No record found with given Id', 404));

	res.status(200).json({
		status: 'success',
		data: {
			quote
		}
	});
});

exports.createQuote = catchAsync(async (req, res, next) => {
	const { name, startDate, endDate, status } = req.body;

	const quote = await Quote.create({ name, startDate, endDate, status, companyId: req.user.companyId });
	
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
	const quote = await Quote.destroy({ where: { quoteId }});

	if (!quote) return next(new AppError('No record found with given Id', 404));

	res.status(204).json({
		status: 'success',
		data: {
			quote
		}
	});
});