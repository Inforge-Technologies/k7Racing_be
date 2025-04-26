const express = require('express');
const router = express.Router();
const adjustmentOfferController = require("../controllers/trn_adjustment_offer.controller");

router.post('/saveOffer', adjustmentOfferController.saveAdjustmentOffer);

router.post("/findOne", adjustmentOfferController.findOneAdjustmentOffer);

router.post("/getOfferById/:id", adjustmentOfferController.getAdjustmentOfferById);

module.exports = router;