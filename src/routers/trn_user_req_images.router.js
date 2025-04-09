const express = require('express');
const router = express.Router();
const requestProductImagesController = require("../controllers/trn_user_req_images.controller");

router.post('/requestProductImages', requestProductImagesController.getRequestProductImages);

module.exports = router;