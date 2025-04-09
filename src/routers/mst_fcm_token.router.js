const express = require("express");
var fcmTokencontroller = require("../controllers/mst_fcm_token.controller");

const router = express.Router();

router.post("/saveFcmToken", fcmTokencontroller.saveFcmToken);

router.post("/fcmTokenList",fcmTokencontroller.getAdminFcmTokens);

router.post("/sendNotificationToUser", fcmTokencontroller.sendNotificationToUser);

router.post("/tokenListForAlert",fcmTokencontroller.tokenListForAlert);

module.exports = router;
