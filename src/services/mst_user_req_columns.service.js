const db = require("../config/dbconfig");

exports.getAllSellColumns = async () => {
    try {
      
        const sellFieldList = await db.SellPrdCol.findAll({
            attributes: {
                exclude: ['isDelete', 'createdAt', 'updatedAt']
            },
            order: [['sort_order', 'ASC']],
        });

        return sellFieldList;
    } catch (error) {
        throw new Error("Failed to fetch sell product columns list: " + error.message);
    }
};