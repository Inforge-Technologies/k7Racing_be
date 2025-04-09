const express = require('express');
const router = express.Router();
const productImagesController = require("../controllers/mst_product_images.controller");

router.post('/productImagesList', productImagesController.getProductImages);

module.exports = router;