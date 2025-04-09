const productService = require("../services/trn_product.service");

exports.saveProduct = async (req, res) => {
    try {
        const productData = JSON.parse(req.body.productData);
        const fieldData = JSON.parse(req.body.fieldData);
        const id = req.body.id;

        const result = await productService.saveProduct(productData, fieldData, req.files, id);

        if (id != null) {
            return res.status(200).json({
                status: "Success",
                message: `Product updated successfully`,
                data: result,
            });
        } else {
            return res.status(200).json({
                status: "Success",
                message: `Product created successfully`,
                data: result,
            });
        }
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};

exports.getAllProductByBudget = async (req, res) => {
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

exports.findAllProducts = async (req, res) => {
    try {
        const { page, size, title, categoryFilter, subcategoryFilter } = req.query;
        const products = await productService.findAllProducts(
            page,
            size,
            title,
            categoryFilter,
            subcategoryFilter
        );
        res.send(products);
    } catch (error) {
        res
            .status(500)
            .send({ success: false, message: "Failed to fetch products" });
    }
};

exports.findProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const user_id = req.body.user_id;
        const product = await productService.findProductById(id, user_id);
        if (product) {
            return res.send({ status: "Success", ProductData: product });
        } else {
            return res
                .status(404)
                .send({ status: "Error", message: "Product not found" });
        }
    } catch (error) {
        res
            .status(500)
            .send({ status: "Error", message: "Failed to find product by ID" });
    }
};

exports.deleteProductData = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await productService.deleteProductData(id);
        res.send(result);
    } catch (error) {
        console.error("Failed to delete product:", error);
        res.status(500).send({ status: "Error", message: "Failed to delete product" });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const { title, userId, priceFilter, role, newestFilter, startPrice, endPrice, offerFilter } = req.query;
        const productList = await productService.getAllProducts(title, userId, priceFilter, role, newestFilter, startPrice, endPrice, offerFilter);
        res.send({ status: "Success", productListAll: productList });
    } catch (error) {
        console.error("Failed to fetch product list:", error);
        res.status(500).send({ success: false, message: "Failed to fetch product list" });
    }
};

exports.filterProductsList = async (req, res) => {
    try {
        const data = req.body;
        const filteredProduct = await productService.filterProductsList(data);
        if (!filteredProduct) {
            return res.status(404).send({ status: "Error", message: "Unable to get product list" });
        }
        return res.send({ productListAll: filteredProduct });
    } catch (error) {
        res.status(500).send({ status: "Error", message: "Unable to get product list" });
    }
};