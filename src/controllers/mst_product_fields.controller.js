const productFieldsService = require("../services/mst_product_fields.service");

exports.getFieldsValue = async (req, res) => {
    try {
        const data = req.body;
        const fieldValues = await productFieldsService.getFieldsValue(data);
        if (!fieldValues) {
            return res.status(404).send({ status: "Error", message: "Unable to get all field values" });
        }
        return res.send({ fieldValues: fieldValues });
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Unable to get field values list" });
    }
};