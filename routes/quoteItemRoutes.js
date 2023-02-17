const express = require('express');
const router = express.Router();
const quoteItemController = require('../controllers/quoteItemController');
const { auth } = require('../middlewares/auth');

router.route('/')
    .post(auth, quoteItemController.createQouteItem)

router.route('/:id')
    .delete(auth, quoteItemController.deleteQuoteItem)

module.exports = router;