const adjustmentOfferService = require("../services/trn_adjustment_offer.service");

exports.saveAdjustmentOffer = async (req, res) => {
  try {
    const offerData = req.body;
    const result = await adjustmentOfferService.saveAdjustmentOffer(offerData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({ status: "Error", message: error.message });
  }
};

exports.findOneAdjustmentOffer = async (req, res) => {
  try {
      const data = req.body;
      const offer = await adjustmentOfferService.findOneAdjustmentOffer(data);
      if (offer) {
          return res.send({ status: "Success", offer: offer });
      } else {
          return res
              .status(404)
              .send({ status: "Error", message: "Adjustment offer data not found" });
      }
  } catch (error) {
      res
          .status(500)
          .send({ status: "Error", message: "Failed to find adjustment offer data" });
  }
};

exports.getAdjustmentOfferById = async (req, res) => {
    try {
        const id = req.params.id;
        const adjOffer = await adjustmentOfferService.getAdjustmentOfferById(id);
        if (adjOffer) {
            return res.send({ status: "Success", offer: adjOffer });
        } else {
            return res
                .status(404)
                .send({ status: "Error", message: "Adjustment offer data not found" });
        }
    } catch (error) {
        res
            .status(500)
            .send({ status: "Error", message: "Failed to find adjustment offer data by ID" });
    }
};