const express = require('express');
const router = express.Router();
const productController = require("../controllers/trn_product.controller");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/saveProduct", upload.any(), productController.saveProduct);

router.post("/allproducts", productController.findAllProducts);

router.post("/findById/:id", productController.findProductById);

router.post("/deleteProduct/:id", productController.deleteProductData);

router.post("/listAllProducts", productController.getAllProducts);

router.post('/filterProductsList', productController.filterProductsList);

module.exports = router;