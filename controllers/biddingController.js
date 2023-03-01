const { Bidding } = require("../models/biddingModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllbid = catchAsync(async (req, res, next) => {
    const bids = await Bidding.findAll();

    res.status(200).json({
        status: 'success',
        data: {
            bids
        }
    });
});

exports.postBid = catchAsync(async (req, res, nex) => {
	const { price, amount, deliveryTime, deliveryTimeUnit, comments, itemId } = req.body;

	const bid = await Bidding.create({ 
            price, amount, deliveryTime, deliveryTimeUnit, 
            comments, itemId, supplierId: req.user.supplierId 
    });
	
	res.status(201).json({
		status: 'success',
		data: {
			bid
		}
	});
});