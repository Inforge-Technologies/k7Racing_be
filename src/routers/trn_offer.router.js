const express = require('express')
const router = express.Router();
const offerController = require("../controllers/trn_offer.controller");

router.post("/saveOfferDetails", offerController.saveOfferDetails);

router.post("/findById/:id", offerController.findOfferById);

module.exports = router;