const productAlertService = require("../services/trn_product_alert.service");

exports.productAlertCreate = async (req, res) => {
    try {
        const data = req.body;
        const productAlert = await productAlertService.productAlertCreate(data);
        res.status(200).json(productAlert);
    } catch (error) {
        res.status(500).send({ status: "Error", message: error.message });
    }
}
