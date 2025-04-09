const express = require('express');
const router = express.Router();
const modelController = require("../controllers/mst_model.controller");

router.post('/modelList', modelController.getModelList);

module.exports = router;