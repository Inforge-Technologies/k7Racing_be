const express = require('express')
const router = express.Router();
const multer = require("multer");
const brandController = require("../controllers/mst_brand.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/save", upload.fields([{ name: "photoUrl" },]), brandController.saveBrand);

router.post("/getBrandList", brandController.getBrandList);

module.exports = router;