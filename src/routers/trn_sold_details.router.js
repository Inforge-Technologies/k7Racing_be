const express = require('express')
const router = express.Router();
const multer = require("multer");
const soldDetailsController = require("../controllers/trn_sold_details.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/save", upload.fields([{ name: "aadharUrl" },]), soldDetailsController.saveSoldDetails);

router.post("/soldProductsList", soldDetailsController.getSoldProductsList);

module.exports = router;