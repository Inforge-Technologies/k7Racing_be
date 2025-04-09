const express = require('express');
const router = express.Router();
const customFieldsController = require("../controllers/mst_custom_fields.controller");

router.post("/createCustomFields", customFieldsController.saveCategoryFields);

router.post('/getAllFields', customFieldsController.getAllFields);

module.exports = router;