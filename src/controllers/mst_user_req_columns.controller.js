const requestColumnssService = require("../services/mst_user_req_columns.service");

exports.getAllSellColumns = async (req, res) => {
    try {
        const sellColumnsList = await requestColumnssService.getAllSellColumns();
        if (!sellColumnsList) {
            return res.status(404).send({ status: "Error", message: "Unable to get sell product columns" });
        }
        return res.send({ allSellColumnsList: sellColumnsList });
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Unable to get sell product columns" });
    }
};