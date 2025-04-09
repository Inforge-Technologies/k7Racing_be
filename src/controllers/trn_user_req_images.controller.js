const requestProductImagesService = require("../services/trn_user_req_images.service");

exports.getRequestProductImages = async (req, res) => {
    try {
        const data = req.body;
        const reqProductImg = await requestProductImagesService.getRequestProductImages(data);
        if (!reqProductImg) {
            return res.status(404).send({ status: "Error", message: "Unable to get all request product images list" });
        }
        return res.send({ reqProductImgList : reqProductImg });
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Unable to get request product images list" });
    }
};