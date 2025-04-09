const express = require('express');
const router = express.Router();
const requestColumnsController = require("../controllers/mst_user_req_columns.controller");

router.post('/requestColumns', requestColumnsController.getAllSellColumns);

module.exports = router;