const requestFieldsService = require("../services/trn_user_req_fields.service");

exports.getRequestFieldsValue = async (req, res) => {
    try {
        const data = req.body;
        const reqFieldValues = await requestFieldsService.getRequestFieldsValue(data);
        if (!reqFieldValues) {
            return res.status(404).send({ status: "Error", message: "Unable to get all request field values" });
        }
        return res.send({ reqFieldValues: reqFieldValues });
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Unable to get request field values list" });
    }
};