const reservedDetailsService = require("../services/trn_reserved_details.service");

exports.saveReservedDetails = async (req, res) => {
    try {
      const reservedData = req.body;
      const result = await reservedDetailsService.saveReservedDetails(reservedData);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).send({ status: "Error", message: error.message });
    }
  };