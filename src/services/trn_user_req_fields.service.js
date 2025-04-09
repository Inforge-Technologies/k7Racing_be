const db = require("../config/dbconfig");

exports.getRequestFieldsValue = async (data) => {
    try {

        const fieldValues = await db.SellPrdFields.findAll({
            attributes: {
                exclude: ['isDelete', 'createdAt', 'updatedAt']
            },
            where: { usr_req_id: data.id },
            include: [
                {
                    model: db.SellPrdCol,
                    attributes: { exclude: ['isDelete', 'createdAt', 'updatedAt'] }
                }
            ]

        });

        return fieldValues;
    } catch (error) {
        throw new Error("Failed to fetch request field values list: " + error.message);
    }
};