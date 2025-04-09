const express = require('express');
const router = express.Router();
const requestFieldsController = require("../controllers/trn_user_req_fields.controller");

router.post('/requestFieldsValue', requestFieldsController.getRequestFieldsValue);

module.exports = router;