const customFieldsService = require("../services/mst_custom_field.service");

exports.saveCategoryFields = async (req, res) => {
    try {
        const data = req.body;
        const result = await customFieldsService.saveCategoryFields(data);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send({ status: "Error", message: error.message });
    }
}

exports.getAllFields = async (req, res) => {
    try {
        const data = req.body;
        const fieldList = await customFieldsService.getAllFields(data);
        if (!fieldList) {
            return res.status(404).send({ status: "Error", message: "Unable to get all fields" });
        }
        return res.send({ allFieldList: fieldList });
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Unable to get fieldList list" });
    }
};