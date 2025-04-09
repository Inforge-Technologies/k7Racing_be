const express = require('express')
const router = express.Router();
const reservedDetailsController = require("../controllers/trn_reserved_details.controller");

router.post("/saveReservedDetails", reservedDetailsController.saveReservedDetails);

module.exports = router;