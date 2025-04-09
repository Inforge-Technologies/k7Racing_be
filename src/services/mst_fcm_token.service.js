const db = require("../config/dbconfig");
const admin = require("firebase-admin");
const Op = db.Sequelize.Op;
const serviceAccountPath = require("../config/market-place-bd719-firebase-adminsdk-fbsvc-473fde6f56.json");

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  databaseURL: 'https://market-place-bd719-default-rtdb.firebaseio.com/'
});

exports.getAdminFcmTokens = async (roleIdJson) => {
    try {

        const roleId = JSON.parse(roleIdJson);
        // Validate that roleId is a number
        if (typeof roleId !== 'number') {
            throw new Error('roleId should be a number');
        }

        const sqlQuery = `
        SELECT mft."login_id" AS id, mft."fcm_token"
        FROM "mst_fcm_token" mft
        WHERE mft."login_id" IN (
          SELECT tl.id
          FROM "trn_login" tl
          WHERE tl."role_id" = :roleId
        )
      `;

        const fcmTokens = await db.sequelize.query(sqlQuery, {
            replacements: { roleId },
            type: db.sequelize.QueryTypes.SELECT,
        });

        return fcmTokens;
    } catch (error) {
        throw new Error(`Error fetching FCM tokens: ${error.message}`);
    }
};

exports.sendNotificationToUser = async (notData) => {
    try {

        // admin.messaging().send(notData)
        // admin.messaging().sendEachForMulticast(notData) // Edited by shalini and sindhu
        admin.messaging().sendEachForMulticast(notData)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
                return response;
            })
            .catch((error) => {
                console.log('Error sending message:', error);
                return error;
            });

    } catch (error) {
        throw new Error("Unable to send notification");
    }
}

exports.tokenListForAlert = async (category_id, subcategory_id, brand_id, model_id, price) => {
    try {
        const priceValue = parseInt(price, 10);
        if (isNaN(priceValue)) {
            throw new Error("Invalid price value");
        }
        const productAlerts = await db.ProductAlert.findAll({
            where: {
                category_id: category_id,
                subcategory_id: subcategory_id,
                brand_id: brand_id,
                model_id: model_id,
                [Op.or]: [
                    { start_range: priceValue }, 
                    { end_range: priceValue }, 
                    { 
                        [Op.and]: { 
                            start_range: { [Op.lte]: priceValue },
                            end_range: { [Op.gte]: priceValue }  // end_range ≥ price
                        } 
                    }
                ]
            }
        });

        // Extract unique login IDs from matched alerts
        const loginIds = [...new Set(productAlerts.map(alert => alert.login_id))];
        if (loginIds.length === 0) {
            return [];
        }

        // Fetch FCM tokens for matched login IDs (without role_id condition)
        const sqlQuery = `
            SELECT mft."login_id" AS id, mft."fcm_token"
            FROM "mst_fcm_token" mft
            WHERE mft."login_id" IN (:loginIds)
        `;

        const fcmTokens = await db.sequelize.query(sqlQuery, {
            replacements: { loginIds },
            type: db.sequelize.QueryTypes.SELECT,
        });

        return fcmTokens;
    } catch (error) {
        throw new Error(`Error fetching FCM tokens: ${error.message}`);
    }
};

