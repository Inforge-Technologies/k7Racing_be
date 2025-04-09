const express = require('express');
const router = express.Router();
const subCategoriesController = require('../controllers/trn_subcategories.controller');

router.post('/create', subCategoriesController.createSubCategory);

router.post('/getAllSubCategories', subCategoriesController.getAllSubCategories);

module.exports = router;