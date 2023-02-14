const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { auth } = require('../middlewares/auth');

router.route('/')
	.get(auth, supplierController.getAllSuppliers)
    .post(auth, supplierController.createSupplier)

router.route('/:id')
    .get(auth, supplierController.getSupplier)
    .patch(auth, supplierController.updateSupplier)
    .delete(auth, supplierController.deleteSupplier)

module.exports = router;