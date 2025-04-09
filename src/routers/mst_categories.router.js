const express = require('express')
const router = express.Router();
const categoryController = require("../controllers/mst_categories.controller");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/create", upload.any(), categoryController.createCategory);

router.post("/getCategoryList", categoryController.getAllCategories);

module.exports = router;