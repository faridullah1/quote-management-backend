const express = require('express');
const router = express.Router();
const biddingController = require('../controllers/biddingController');
const { auth } = require('../middlewares/auth');


router.route('/')
	.get(auth, biddingController.getAllbid)
    .post(auth, biddingController.postBid)

module.exports = router;