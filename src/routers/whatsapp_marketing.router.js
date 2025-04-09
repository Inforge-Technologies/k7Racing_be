const express = require('express')
const router = express.Router();
const multer = require("multer");
const waUserReq = require("../controllers/trn_user_req.controller");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/save", upload.fields([{ name: "photoUrl" },]), brandController.saveBrand);

router.post("/getNewUsers", waUserReq.getallUserReq);

module.exports = router;