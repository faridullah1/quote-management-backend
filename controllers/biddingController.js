const { Bidding } = require("../models/biddingModel");
const { Supplier } = require("../models/supplierModel");
const catchAsync = require("../utils/catchAsync");

exports.quoteItemBidDetail = catchAsync(async (req, res, nex) => {
    // #swagger.tags = ['Bidding']
    // #swagger.description = 'Endpoint for getting bids that is placed by supplier against a specific quote item.'

    const quoteItemId = +req.params.quoteItemId;

    const bids = await Bidding.findAll({ 
        where: { itemId: quoteItemId },
        include: [
            {
                model: Supplier,
                where: {
                    companyId: req.user.companyId
                }
            }
        ]
    });

    res.status(200).json({
		status: 'success',
		data: {
			bids
		}
	});    
});

exports.postBid = catchAsync(async (req, res, nex) => {
    // #swagger.tags = ['Bidding']
    // #swagger.description = 'Endpoint for posting a bid on quote item by supplier.'

	const { price, amount, deliveryTime, deliveryTimeUnit, isBidIgnored, comments, itemId } = req.body;
    let bid;

    if (isBidIgnored) {
        bid = await Bidding.create({ 
            price: -1, amount: -1, deliveryTime: new Date(0), deliveryTimeUnit: 'Days', isBidIgnored,
            itemId, supplierId: req.user.supplierId 
        });
    } 
    else {
        await Bidding.create({ 
            price, amount, deliveryTime, deliveryTimeUnit, 
            comments, itemId, supplierId: req.user.supplierId 
        });
    }
	
	res.status(201).json({
		status: 'success',
		data: {
			bid
		}
	});
});