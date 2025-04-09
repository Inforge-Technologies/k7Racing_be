const db = require("../config/dbconfig");

exports.getRequestProductImages = async (data) => {
    try {
       
        const requestProductImg = await db.user_req_images.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            where: {usr_req_id: data.id},
            order: [["id", "ASC"]],
    
        });

        return requestProductImg;
    } catch (error) {
        throw new Error("Failed to fetch request product images list: " + error.message);
    }
};