const brandService = require("../services/mst_brand.service");

exports.saveBrand = async (req, res) => {
  try {
    const brandData = req.body;
    const photoUrl = req.files.photoUrl ? req.files.photoUrl[0] : null;
    const imgPath = process.env.protocol + process.env.domain;
    const result = await brandService.saveBrand(
      brandData,
      photoUrl,
      imgPath
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to save branch:", error);
    res
      .status(500)
      .send({ status: "Error", message: error.message });
  }
};

exports.getBrandList = async (req, res) => {
  try {
    const getAllBrand = await brandService.getBrandList();
    if (!getAllBrand) {
      return res.status(404).send({ status: "Error", message: "Unable to get brand list" });
    }
    return res.send({ getAllBrandList: getAllBrand });
  } catch (error) {
    res.status(500).send({ status: "Error", message: "Unable to find brand list" });
  }
};