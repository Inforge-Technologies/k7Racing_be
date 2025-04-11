const db = require("../config/dbconfig");

exports.changeFavouritesStatus = async (body) => {
    const { product_id, user_id } = body;

    try {
        // Check if the favorite already exists
        const existingFavourite = await db.UserFavourites.findOne({
            where: { product_id, user_id }
        });

        if (existingFavourite) {
            // If it exists, update the isDelete status
            await existingFavourite.update({ isDelete: !existingFavourite.isDelete });
            return { message: "Favourite status updated successfully" };
        } else {
            // If it doesn't exist, create a new record
            await db.UserFavourites.create({
                product_id,
                user_id,
                isDelete: false // Default to false when creating
            });
            return { message: "Favourite added successfully" };
        }
    } catch (error) {
        throw new Error("Failed to update favourite status: " + error.message);
    }
};

exports.getAllLikedProducts = async (user_id) => {
    try {
        return await db.UserFavourites.findAll({
            where: {
                user_id: user_id,
                isDelete: false, // Only fetch active liked products
            },
            include: [
                {
                    model: db.Products,
                    as: "trn_product",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "isDelete"], // Exclude unnecessary fields from Products
                    },
                },
            ],
        });
    } catch (error) {
        throw new Error("Failed to fetch liked products: " + error.message);
    }
};

