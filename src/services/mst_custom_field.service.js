const db = require("../config/dbconfig");
const Op = db.Sequelize.Op;

exports.saveCategoryFields = async (data) => {
    try {
        const { category_id, subcategory_id, prd_col_id } = data;
        const fieldIds = JSON.parse(prd_col_id);

        if (!Array.isArray(fieldIds)) {
            throw new Error("Invalid field data");
        }

        let newFields = [];

        for (const fieldId of fieldIds) {
            // Check if the field already exists for the category and subcategory

            let whereCondition = { category_id, prd_col_id: fieldId };

            // Include subcategory_id only if it's not null
            if (subcategory_id != 0 || subcategory_id != '0') {
                whereCondition.subcategory_id = subcategory_id;
            }
            const existingField = await db.CustomFields.findOne({
                where: whereCondition,
            });

            // If it doesn't exist, add to the save list
            if (!existingField) {
                let newFieldData = { category_id, prd_col_id: fieldId };

                // Include subcategory_id only if it's not null
                if (subcategory_id != 0 || subcategory_id != '0') {
                    newFieldData.subcategory_id = subcategory_id;
                }

                newFields.push(newFieldData);
            }
        }

        if (newFields.length > 0) {
            await db.CustomFields.bulkCreate(newFields);
            return { status: "Success", message: "Category fields saved successfully" };
        } else {
            return { status: "Error", message: "fields already mapped to category" };
        }
    } catch (error) {
        throw new Error("Failed to save category fields: " + error.message);
    }
};

exports.getAllFields = async (data) => {
    try {
        const whereCondition =  {};

        if (data.subcategory_id !== null && data.subcategory_id !== 'null') {
            whereCondition.subcategory_id = data.subcategory_id;
        }

        if (data.category_id !== null && data.category_id !== 'null') {
            whereCondition.category_id = data.category_id;
        }

        const includeConditions = [
            {
                model: db.Categories,
                attributes: { exclude: ['isDelete', 'createdAt', 'updatedAt'] }
            },
            {
                model: db.SubCategories,
                attributes: { exclude: ['isDelete', 'createdAt', 'updatedAt'] }
            },
            {
                model: db.ProductColumns,
                as: 'mst_product_column',
                attributes: { exclude: ['isDelete', 'createdAt', 'updatedAt'] }
            }
        ];

        // If allowInFilter is true, add an extra condition to the ProductColumns model
        if (data.allowInFilter === 'true') {
            includeConditions[2].where = { allow_in_filter: true };
        }

        const filteredProduct = await db.CustomFields.findAll({
            attributes: {
                exclude: ['isDelete', 'createdAt', 'updatedAt']
            },
            where: whereCondition,
            order: [['id', 'ASC']],
            include: includeConditions
        });

        return filteredProduct;
    } catch (error) {
        throw new Error('Failed to fetch fields list: ' + error.message);
    }
};