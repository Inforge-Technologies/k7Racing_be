const db = require("../config/dbconfig");

exports.getFieldsValue = async (data) => {
    try {

        const fieldValues = await db.ProductFields.findAll({
            attributes: {
                exclude: ['isDelete', 'createdAt', 'updatedAt']
            },
            where: { prd_id: data.id },
            include: [
                {
                    model: db.ProductColumns,
                    attributes: { exclude: ['isDelete', 'createdAt', 'updatedAt'] }
                }
            ]

        });

        return fieldValues;
    } catch (error) {
        throw new Error("Failed to fetch field values list: " + error.message);
    }
};