const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { auth } = require('../middlewares/auth');

router.route('/released').get(auth, quoteController.getAllReleasedQuotesBySupplier);

router.route('/')
	.get(auth, quoteController.getAllQuotes)
    .post(auth, quoteController.createQuote)

router.route('/:id')
    .get(auth, quoteController.getQuote)
    .patch(auth, quoteController.updateQuote)
    .delete(auth, quoteController.deleteQuote)

module.exports = router;