const userFavouritesService = require("../services/trn_user_favourites.service");

exports.changeFavouritesStatus = async (req, res) => {
  try {
    const body = req.body;
    const result = await userFavouritesService.changeFavouritesStatus(body);
    return res.send({
      status: "Success",
      message: "update successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .send({ status: "Error", message: "Failed to update status" });
  }
};

exports.getAllLikedProducts = async (req, res) => {
  try {
    const userId = req.query.userId;
    const likedProductList = await userFavouritesService.getAllLikedProducts(userId);
    res.send({ status: "Success", likedProductListAll: likedProductList });
  } catch (error) {
    console.error("Failed to fetch liked product list:", error);
    res.status(500).send({ success: false, message: "Failed to fetch liked product list" });
  }
};