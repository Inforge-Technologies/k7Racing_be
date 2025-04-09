const express = require('express');
const router = express.Router();
const productAlertController = require("../controllers/trn_product_alert.controller");

router.post("/productAlertCreate", productAlertController.productAlertCreate);

module.exports = router;