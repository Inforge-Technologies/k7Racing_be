const soldDetailsService = require("../services/trn_sold_details.service");

exports.saveSoldDetails = async (req, res) => {
  try {
    const soldDetails = req.body;
    const aadharUrl = req.files.aadharUrl ? req.files.aadharUrl[0] : null;
    const imgPath = process.env.protocol + process.env.domain;
    const result = await soldDetailsService.saveSoldDetails(
      soldDetails,
      aadharUrl,
      imgPath
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to save sold details:", error);
    res
      .status(500)
      .send({ status: "Error", message: error.message });
  }
};

exports.getSoldProductsList = async (req, res) => {
    try {
        const { page, size, title } = req.query;
        const soldProducts = await soldDetailsService.getSoldProductsList(
            page,
            size,
            title
        );
        res.send(soldProducts);
    } catch (error) {
        res
            .status(500)
            .send({ success: false, message: "Failed to fetch sold products list" });
    }
};