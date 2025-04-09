const db = require("../config/dbconfig");
const fcmTokenService = require("../services/mst_fcm_token.service");

exports.saveFcmToken = async (req, res) => {
    var fcmTokenData = req.body;

    try {

        const existingToken = await db.FcmToken.findOne({
            where: {
                login_id: fcmTokenData.login_id,
            },
        });

        var date = new Date();
        fcmTokenData.updatedAt = date;

        if (!existingToken) {
            fcmTokenData.createdDate = date;
            db.FcmToken.create(fcmTokenData).then((save) => {
                return res.send({
                    status: "Success",
                    message: "FCM token is saved successfully",
                });
            });
        } else {
            db.FcmToken.update(fcmTokenData, { where: { id: existingToken.id } }).then((save) => {
                return res.send({
                    status: "Success",
                    message: "FCM token is updated successfully",
                });
            });
        }
    } catch (error) {
        return res.send({
            status: "Error",
            message: error,
        });
    }
};

exports.getAdminFcmTokens = async (req, res) => {
    try {
        const { role_id } = req.body;
        const fcmTokens = await fcmTokenService.getAdminFcmTokens(role_id);
        if (fcmTokens) {
            return res.send({ status: "Success", data: fcmTokens });
        } else {
            return res
                .status(404)
                .send({ status: "Error", message: "login not found" });
        }
    } catch (error) {
        res
            .status(500)
            .send({ status: "Error", message: "Failed to find Login by role id" });
    }
};

exports.sendNotificationToUser = async (req, res) => {
    try {
        const notData = req.body;
        const notMsg = await fcmTokenService.sendNotificationToUser(notData);
        res.send({ success: true, message: notMsg });
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Failed to send notification" });
    }
}

exports.tokenListForAlert = async (req, res) => {
    try {
        const { category_id, subcategory_id, brand_id, model_id, price } = req.body;
        const fcmTokens = await fcmTokenService.tokenListForAlert( category_id, subcategory_id, brand_id, model_id, price );
        if (fcmTokens) {
            return res.send({ status: "Success", data: fcmTokens });
        } else {
            return res
                .status(404)
                .send({ status: "Error", message: "login not found" });
        }
    } catch (error) {
        res
            .status(500)
            .send({ status: "Error", message: "Failed to find Login by role id" });
    }
};
