const db = require("../config/dbconfig");

exports.createSubCategory = async (subCategoryData) => {
    try {
        // Find the existing district
        const existingSubCategory = await db.SubCategories.findOne({
            where: {
                name: subCategoryData.name,
                categoryId: subCategoryData.categoryId,
            },
        });
        if (existingSubCategory) {
            throw new Error("Categories already exists");                   // Check if sub categories already exists
        }

        const subCategory = await db.SubCategories.create(subCategoryData);          // Create the new sub categories
        return subCategory;

    } catch (error) {
        throw new Error("Failed to craete sub categories" + error.message);
    }
};

// Get all categories
exports.getAllSubCategories = async (data) => {
    try {
        const subCategoriesList = await db.SubCategories.findAll({
            attributes: {
                exclude: ['isDelete', 'createdAt', 'updatedAt']
            },
            where: {
                category_id: data.categoryId,
            
            },
            order: [
                ['id', 'ASC']
            ],

        });
        return subCategoriesList;
    } catch (error) {
        throw new Error("Failed to featch sub categories list" + error.message);
    }
}