const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

router.route('/')
	.get(companyController.getAllCompanies)
    .post(companyController.createCompany)

module.exports = router;