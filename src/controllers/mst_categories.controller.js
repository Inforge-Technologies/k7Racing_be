const categoryService = require("../services/mst_categories.service");

// // Create cateagory
// exports.createCategory = async (req, res) => {
//     try {
//         const categoryData = req.body;
//         const imageUrl = req.files.imageUrl ? req.files.imageUrl[0] : null;
//         const imgPath = process.env.protocol + process.env.domain;
//         const category = await categoryService.createCategory(categoryData, imageUrl, imgPath);
//         return res.send({ status: "Success", message: `${category.category_name} category created successfully` });
//     } catch (error) {
//         res.status(500).send({ status: "Error", message: error.message });
//     }
// };

exports.createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        const imgPath = `${process.env.protocol}${process.env.domain}`;
        
        // Handle category image
        var categoryImage = req.files[0]?? null;

        // Call service to create category and save subcategory images
        const category = await categoryService.createCategory(categoryData, categoryImage, imgPath, req.files);

        return res.status(200).json({
            status: "Success",
            message: `${category.category_name} category created successfully`,
            data: category,
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};


// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const data = req.body;
        const getAllCategories = await categoryService.getAllCategories(data);
        if (!getAllCategories) {
            return res.status(404).send({ status: "Error", message: "Unable to get categories" });
        }
        return res.send({ getAllCategoriesList: getAllCategories });
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Unable to find category list" });
    }
};
