const router = require('express').Router();
const colorController= require("../controllers/mst_colors.controller");

router.post("/findAll", colorController.findAllColors);

module.exports = router;