const db = require("../config/dbconfig");

exports.getProductImages = async (data) => {
    try {
       
        const productImg = await db.ProductImage.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            where: {prd_id: data.id},
            order: [["id", "ASC"]],
    
        });

        return productImg;
    } catch (error) {
        throw new Error("Failed to fetch product images list: " + error.message);
    }
};