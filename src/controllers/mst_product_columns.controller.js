const productColumnService = require("../services/mst_product_column.service");

exports.productColumnCreate = async (req, res) => {
    try {
        const data = req.body;
        const productInfo = await productColumnService.productColumnCreate(data);
        res.status(200).json(productInfo);
    } catch (error) {
        res.status(500).send({ status: "Error", message: error.message });
    }
}


exports.getFieldsList = async (req, res) => {
    try {
        const data = req.body;
        const getAllFields = await productColumnService.getFieldsList(data);
        if (!getAllFields) {
            return res.status(404).send({ status: "Error", message: "Unable to get fields" });
        }
        return res.send({ getAllFieldsList : getAllFields });
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Unable to find fields list" });
    }
};