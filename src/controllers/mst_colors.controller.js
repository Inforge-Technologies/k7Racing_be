const colorService = require("../services/mst_colors.service");

exports.findAllColors = async (req, res) => {
  try {
    const getAllColor = await colorService.findAllColors();
    if (!getAllColor) {
      return res.status(404).send({ status: "Error", message: "Unable to get color list" });
    }
    return res.send({ getAllColorList: getAllColor });
  } catch (error) {
    res.status(500).send({ status: "Error", message: "Unable to find color list" });
  }
};