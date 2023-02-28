const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { auth } = require('../middlewares/auth');

router.route('/')
	.get(auth, groupController.getAllGroups)
	.post(auth, groupController.createGroup);

module.exports = router;