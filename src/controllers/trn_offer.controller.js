const offerService = require("../services/trn_offer.service");

exports.saveOfferDetails = async (req, res) => {
  try {
    const offerData = req.body;
    const result = await offerService.saveOfferDetails(offerData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({ status: "Error", message: error.message });
  }
};

exports.findOfferById = async (req, res) => {
    try {
        const id = req.params.id;
        const offer = await offerService.findOfferById(id);
        if (offer) {
            return res.send({ status: "Success", offer: offer });
        } else {
            return res
                .status(404)
                .send({ status: "Error", message: "offer data not found" });
        }
    } catch (error) {
        res
            .status(500)
            .send({ status: "Error", message: "Failed to find offer data by ID" });
    }
};