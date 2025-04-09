const modelService = require("../services/mst_model.service");

exports.getModelList = async (req, res) => {
  try {
    
    const getAllModel = await modelService.getModelList(req.body);
    if (!getAllModel) {
      return res.status(404).send({ status: "Error", message: "Unable to get model list" });
    }
    return res.send({ getAllModelList: getAllModel });
  } catch (error) {
    res.status(500).send({ status: "Error", message: "Unable to find model list" });
  }
};