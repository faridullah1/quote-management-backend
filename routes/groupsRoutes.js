const express = require('express');
const router = express.Router();
const groupController = require('../controllers/supplierGroupDetailController');
const { auth } = require('../middlewares/auth');

router.route('/')
	.get(auth, groupController.getAllSupplierGroupDetail)
    .post(auth, groupController.createGroup)

router.route('/:id')
    .get(auth, groupController.getGroup)
    .patch(auth, groupController.updateGroup)
    .delete(auth, groupController.deleteGroup)

module.exports = router;