const express = require('express');
const router = express.Router();
const biddingController = require('../controllers/biddingController');
const { auth } = require('../middlewares/auth');


router.route('/')
    .post(auth, biddingController.postBid)

module.exports = router;