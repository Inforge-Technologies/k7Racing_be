const express = require("express");
const router = express.Router();
const loginController = require("../controllers/trn_login.controller");

router.post("/saveNewUser", loginController.saveNewUser);

router.post("/userLogin", loginController.userLogin);

router.post("/checkNewUser", loginController.checkNewUser);

module.exports = router;
