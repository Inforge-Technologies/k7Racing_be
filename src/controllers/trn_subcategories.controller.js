const subCategoryService = require("../services/trn_subcategories.service");

// Create cateagory
exports.createSubCategory = async (req, res) => {
    try {
        const data = req.body;
        const subCategory = await subCategoryService.createSubCategory(data);
        return res.send({ status: "Success", message: `${category.name} sub category created successfully` });
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Unable to create sub category " });
    }
};

// Get all sub categories
exports.getAllSubCategories = async (req, res) => {
    try {
        const data = req.body;
        const subCategoriesList = await subCategoryService.getAllSubCategories(data);
        if (!subCategoriesList) {
            return res.status(404).send({ status: "Error", message: "Unable to get all sub categories" });
        }
        return res.send({ allSubCategoriesList: subCategoriesList });
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Unable to get sub category list" });
    }
};
