const express = require('express');
const router = express.Router();
const userFavouritesController = require("../controllers/trn_user_favourites.controller");

router.post("/FavouritesStatus", userFavouritesController.changeFavouritesStatus);

router.post("/listAllLikedProducts", userFavouritesController.getAllLikedProducts);

module.exports = router;