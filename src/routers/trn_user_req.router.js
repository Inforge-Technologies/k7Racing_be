const express = require('express');
const router = express.Router();
const userReqCont = require('../controllers/trn_user_req.controller');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/saveReqProduct", upload.any(), userReqCont.saveReqProduct);

router.post('/getalluserreq', userReqCont.getallUserReq);
// router.post('/getAllSubCategories', subCategoriesController.getAllSubCategories);

router.post("/listAllUserReq", userReqCont.getAllUserRequests);

router.post("/findById/:id", userReqCont.findRequestProductById);

router.post("/UserReqSellList", userReqCont.getUserReqSellList);

router.post("/deleteUserRequest/:id", userReqCont.deleteUserRequest);

module.exports = router;