const express = require('express');
const router = express.Router();
const productFieldsController = require("../controllers/mst_product_fields.controller");

router.post('/productFieldsValue', productFieldsController.getFieldsValue);

module.exports = router;