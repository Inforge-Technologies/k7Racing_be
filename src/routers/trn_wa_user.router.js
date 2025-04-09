const express = require("express");
const router = express.Router();
const WhatsappUserController = require("../controllers/trn_wa_user.controller");

router.post("/mobileNoList", WhatsappUserController.getMobileNoList);

router.post("/get-user/:mobileNo", WhatsappUserController.getUserByMobile);

module.exports = router;
