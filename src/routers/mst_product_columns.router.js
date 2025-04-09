const express = require('express');
const router = express.Router();
const productColumnController = require("../controllers/mst_product_columns.controller");

router.post("/productColumnCreate", productColumnController.productColumnCreate);

router.post("/getFieldsList", productColumnController.getFieldsList);

module.exports = router;