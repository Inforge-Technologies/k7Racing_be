const productImagesService = require("../services/mst_product_images.service");

exports.getProductImages = async (req, res) => {
    try {
        const data = req.body;
        const productImg = await productImagesService.getProductImages(data);
        if (!productImg) {
            return res.status(404).send({ status: "Error", message: "Unable to get all product images list" });
        }
        return res.send({ productImgList : productImg });
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Unable to get product images list" });
    }
};