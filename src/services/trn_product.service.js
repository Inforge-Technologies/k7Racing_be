const db = require("../config/dbconfig");
const Op = db.Sequelize.Op;
const fs = require("fs");
const path = require("path");
const sharp = require('sharp');
const mime = require('mime-types');
const sequelize = db.sequelize;

exports.saveProduct = async (productData, fieldData, files, id) => {
    const transaction = await db.sequelize.transaction();

    try {
        const existingProduct = await db.Products.findOne({
            where: {
                category_id: productData.category_id,
                subcategory_id: productData.subcategory_id != 'null' ? productData.subcategory_id : { [Op.is]: null },
                posted_by: productData.posted_by,
                prd_title: productData.prd_title,
            },
        });

        if (existingProduct && !id) {
            await transaction.rollback();
            throw new Error("Product already exists");
        }

        const imgPath = `${process.env.protocol}${process.env.domain}`;
        let rcImagePath = null;
        let coverImagePath = null;

        if (files[0]) {
            rcImagePath = await saveImage(files[0], imgPath, "productImage", `product_${Date.now()}`);
        }
        
        if (files[1]) {
            coverImagePath = await saveImage(files[1], imgPath, "productImage", `product_${Date.now()}`);
        }

        let product;
        if (id) {

            product = await db.Products.findByPk(id);
            if (!product) {
                await transaction.rollback();
                throw new Error("Product not found");
            }

            await product.update(
                {
                    category_id: productData.category_id,
                    subcategory_id: productData.subcategory_id != 'null' ? productData.subcategory_id : null,
                    brand_id: productData.brand_id,
                    model_id: productData.model_id,
                    prd_title: productData.prd_title,
                    prd_description: productData.prd_description,
                    prd_type: productData.prd_type,
                    post_date: productData.post_date,
                    posted_by: productData.posted_by,
                    purchase_price: productData.purchase_price,
                    purchased_from: productData.purchased_from,
                    selling_price: productData.selling_price,
                    dealer_price: productData.dealer_price,
                    prd_status: productData.prd_status,
                    tax: productData.tax,
                    reg_no: productData.reg_no,
                    // km_driven: productData.km_driven,
                    // no_of_owners: productData.no_of_owners,
                    color_id: productData.color,
                    youtube_link: productData.youtube_link,
                    fb_link: productData.fb_link,
                    insta_link: productData.insta_link,
                    ...(rcImagePath && { rcimage: rcImagePath }),
                    ...(coverImagePath && { cover_image: coverImagePath })
                },
                { transaction }
            );
        } else {
            product = await db.Products.create(
                {
                    category_id: productData.category_id,
                    subcategory_id: productData.subcategory_id != 'null' ? productData.subcategory_id : null,
                    brand_id: productData.brand_id,
                    model_id: productData.model_id,
                    prd_title: productData.prd_title,
                    prd_description: productData.prd_description,
                    prd_type: productData.prd_type,
                    post_date: productData.post_date,
                    posted_by: productData.posted_by,
                    purchase_price: productData.purchase_price,
                    purchased_from: productData.purchased_from,
                    selling_price: productData.selling_price,
                    dealer_price: productData.dealer_price,
                    prd_status: productData.prd_status,
                    tax: productData.tax,
                    reg_no: productData.reg_no,
                    // km_driven: productData.km_driven,
                    // no_of_owners: productData.no_of_owners,
                    color_id: productData.color,
                    youtube_link: productData.youtube_link,
                    fb_link: productData.fb_link,
                    insta_link: productData.insta_link,
                    rcimage: rcImagePath,
                    cover_image: coverImagePath,
                },
                { transaction }
            );
        }

        const productId = product.id;

        for (const field of fieldData) {
            const existingField = await db.ProductFields.findOne({
                where: { prd_id: productId, prd_col_id: field.prd_col_id },
            });

            if (existingField) {
                await existingField.update({ field_value: field.field_value }, { transaction });
            } else {
                await db.ProductFields.create(
                    {
                        prd_id: productId,
                        prd_col_id: field.prd_col_id,
                        field_value: field.field_value,
                    },
                    { transaction }
                );
            }
        }

        const existingImages = await db.ProductImage.findAll({ where: { prd_id: productId } });

        for (let i = 2; i < files.length; i++) {
            const productImagePath = await saveImage(files[i], imgPath, "productImage", `product_${Date.now()}`);

            if (existingImages[i - 2]) {
                // Update existing image
                await existingImages[i - 2].update({ image_url: productImagePath }, { transaction });
            } else {
                // Create new image
                await db.ProductImage.create(
                    {
                        prd_id: productId,
                        image_url: productImagePath
                    },
                    { transaction }
                );
            }
        }

        await transaction.commit();
        return product;
    } catch (error) {
        await transaction.rollback();
        throw new Error("Failed to create product: " + error.message);
    }
};

function saveImage(file, imgPath, uploadDir_, filename) {
    return new Promise((resolve, reject) => {
        try {
            // Check mime type using mime-types
            const mimeType = mime.lookup(file.originalname);  // Get mime type from file name
            if (!mimeType || !mimeType.startsWith('image/')) {
                return reject(new Error('Invalid file type. Only image files are allowed.'));
            }

            // Set the upload directory
            const uploadDir = path.join(__dirname, "..", "..", "resources", "assets", uploadDir_);

            // Ensure the directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Get the file extension and prepare the database save path
            const extension = mime.extension(mimeType);  // Get the file extension from mime type
            const dbSavePath = `${imgPath}/resources/assets/${uploadDir_}/${filename}.${extension}`;

            // Prepare the full path where the image will be saved
            const imagePath = path.join(__dirname, "..", "..", "resources", "assets", uploadDir_, `${filename}.${extension}`);

            // Use sharp to resize and compress the image based on its mime type
            let imageProcessor = sharp(file.buffer);

            // Resize the image and apply compression depending on the mime type
            if (mimeType === 'image/jpeg' || extension === 'jpg') {
                imageProcessor = imageProcessor.resize(1024).jpeg({ quality: 80 });
            } else if (mimeType === 'image/png') {
                imageProcessor = imageProcessor.resize(1024).png({ quality: 80 });
            } else if (mimeType === 'image/webp') {
                imageProcessor = imageProcessor.resize(1024).webp({ quality: 80 });
            } else {
                return reject(new Error('Unsupported image format.'));
            }

            // Check if the file size is small and skip resizing if it's under 5 KB
            if (file.size <= 5000) {  // Skip resizing for very small images
                fs.writeFileSync(imagePath, file.buffer);
                return resolve(dbSavePath.replace('http://', 'http://'));
            }

            // Save the image to the filesystem
            imageProcessor.toFile(imagePath, (err, info) => {
                if (err) {
                    reject(err);  // Reject if there's an error
                } else {
                    resolve(dbSavePath.replace('http://', 'http://'));   // Resolve with the path to the image in the database
                }
            });

        } catch (error) {
            console.log(error.message);
            reject(error);  // Reject the promise if there's an error in the try-catch block
        }
    });
}

exports.getAllProductByBudget = async (data) => {
    try {
        const prdList = await db.Products.findAll({
            attributes: {
                exclude: ['isDelete', 'createdAt', 'updatedAt']
            },
            where: {
                selling_price: {
                    [Op.and]: {
                        [Op.gt]: data.min, [Op.lt]: data.max
                    }
                },
                isDelete: false
            },
            limit: 10,
            order: [
                ['id', 'ASC']
            ],

        });
        return prdList;
    } catch (error) {
        throw new Error("Failed to featch sub categories list" + error.message);
    }
}

exports.getAllProductByCatAndSub = async (data) => {
    try {
        const prdList = await db.Products.findAll({
            attributes: {
                exclude: ['isDelete', 'createdAt', 'updatedAt']
            },
            where: {
                category_id: data.category_id,
                subcategory_id: data.subcategory_id,
                isDelete: false
            },
            limit: 10,
            order: [
                ['id', 'ASC']
            ],

        });
        return prdList;
    } catch (error) {
        throw new Error("Failed to featch sub categories list" + error.message);
    }
}

exports.getSinglePrdInfo = async (data) => {
    try {
        const prdList = await db.Products.findOne({
            attributes: {
                exclude: ['isDelete', 'createdAt', 'updatedAt']
            },
            include: [{
                model: db.ProductFields,

                include: {
                    model: db.ProductColumns,
                    attributes: ["field"]
                },
                attributes: ["field_value"],

            }],
            where: {
                id: data.id
            },

        });
        return prdList;
    } catch (error) {
        throw new Error("Failed to featch sub categories list" + error.message);
    }
}

exports.getSinglePrdImages = async (data) => {
    try {
        const prdList = await db.ProductImage.findAll({
            attributes: {
                exclude: ['isDelete', 'createdAt', 'updatedAt']
            },
            where: {
                prd_id: data.id
            },

        });
        return prdList;
    } catch (error) {
        throw new Error("Failed to featch sub categories list" + error.message);
    }
}

exports.findAllProducts = async (
    page,
    size,
    title,
    categoryFilter,
    subcategoryFilter
) => {
    try {
        var condition = { isDelete: false };

        // if (title && title != "undefined") {
        //     const titleLower = title.toLowerCase();
        //     var titleCondition = {
        //         [Op.or]: [
        //             sequelize.where(
        //                 sequelize.fn("LOWER", sequelize.col("regionEnglish")),
        //                 "LIKE",
        //                 `%${titleLower}%`
        //             ),
        //             {
        //                 regionTamil: {
        //                     [Op.like]: `%${title}%`,
        //                 },
        //             },
        //             sequelize.where(
        //                 sequelize.fn("LOWER", sequelize.col("mst_state.English")),
        //                 "LIKE",
        //                 `%${titleLower}%`
        //             ),
        //             sequelize.where(
        //                 sequelize.fn("LOWER", sequelize.col("mst_district.dstctEnglish")),
        //                 "LIKE",
        //                 `%${titleLower}%`
        //             ),
        //         ],
        //     };

        //     condition = Object.assign(condition, titleCondition);
        // }

        if (categoryFilter && categoryFilter != "undefined") {
            var categoryFilterCondition = {
                category_id: {
                    [Op.eq]: categoryFilter,
                },
            };
            condition = Object.assign(condition, categoryFilterCondition);
        }

        if (subcategoryFilter && subcategoryFilter != "undefined") {
            var subcategoryFilterCondition = {
                subcategory_id: {
                    [Op.eq]: subcategoryFilter,
                },
            };
            condition = Object.assign(condition, subcategoryFilterCondition);
        }

        const { limit, offset } = getPagination(page, size);
        const products = await db.Products.findAndCountAll({
            limit,
            offset,
            where: condition,
            order: [["id", "DESC"]],
            attributes: {
                exclude: ["createdAt", "updatedAt", "isDelete"], // "createdAt", "updatedAt"
            },
            include: [
                {
                    model: db.Categories,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "isDelete"], // "createdAt", "updatedAt"
                    },
                },
                {
                    model: db.SubCategories,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "isDelete"], // "createdAt", "updatedAt"
                    },
                },
                {
                    model: db.Brand,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"], // "createdAt", "updatedAt"
                    },
                },
                {
                    model: db.Model,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"], // "createdAt", "updatedAt"
                    },
                },
            ],
        });

        return getPagingData(products, page, limit);
    } catch (error) {
        throw new Error("Failed to fetch products: " + error.message);
    }
};

const getPagination = (page, size) => {
    const limit = size ? +size : 8;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalElements, rows: productList } = data;
    const pageNumber = page ? +page : 0;
    const totalPages = Math.ceil(totalElements / limit);
    return { totalElements, productList, totalPages, pageNumber };
};

exports.findProductById = async (id, user_id) => {
    try {
        // Define the base include array
        let include = [
            {
                model: db.Brand,
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            },
            {
                model: db.Model,
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            },
            {
                model: db.Offer,
                as: "trn_offers",
                required: false, 
                attributes: ["id", "product_id", "offer_selling_price", "offer_dealer_price"],
            },
            {
                model: db.Login,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "password"],
                },
            },
            {
                model: db.Color,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "isDelete"],
                },
            }
        ];

        // Include Model only if user_id is NOT null
        if (user_id !== 'null') {
            include.push({
                model: db.UserFavourites,
                attributes: ["id", "user_id", "product_id", "isDelete"],
                where: {
                    user_id: user_id
                },
                required: false
            });
        }

        // Fetch the product
        const product = await db.Products.findOne({
            where: {
                id: id,
                isDelete: false,
            },
            attributes: {
                exclude: ["isDelete"],
            },
            include: include, // Dynamically include models
        });

        return product;
    } catch (error) {
        throw new Error("Failed to find Product by ID: " + error.message);
    }
};


exports.deleteProductData = async (id) => {
    try {
        const result = await db.Products.update(
            { isDelete: true },
            { where: { id: id } }
        );
        if (result[0] === 0) {
            throw new Error("Product not found or not deleted");
        }
        return {
            status: "Success",
            message: "Product deleted successfully"
        };
    } catch (error) {
        throw new Error("Failed to delete product: " + error.message);
    }
};

exports.getAllProducts = async (title, user_id, priceFilter, role, newestFilter, startPrice, endPrice, offerFilter) => {
    try {
        let condition = { isDelete: false, prd_status: 1 };
        let order = [];

        // Select price field dynamically based on role
        const priceField = role === '2' ? "dealer_price" : "selling_price";

        // Handle title filtering
        if (title && title !== "undefined") {
            const titleLower = title.toLowerCase();
            const titleCondition = {
                [Op.or]: [
                    sequelize.where(sequelize.fn("LOWER", sequelize.col("prd_title")), "LIKE", `%${titleLower}%`),
                    sequelize.where(sequelize.fn("LOWER", sequelize.col("prd_description")), "LIKE", `%${titleLower}%`),
                    sequelize.where(sequelize.fn("LOWER", sequelize.col("mst_brand.brand_name")), { [Op.like]: `%${titleLower}%` }),
                    sequelize.where(sequelize.fn("LOWER", sequelize.col("mst_model.model_name")), { [Op.like]: `%${titleLower}%` }),
                    sequelize.where(sequelize.fn("LOWER", sequelize.col("mst_category.category_name")), { [Op.like]: `%${titleLower}%` }),
                    sequelize.where(sequelize.fn("LOWER", sequelize.col("trn_subcategory.subcategory_name")), { [Op.like]: `%${titleLower}%` }),
                ],
            };
            condition = { ...condition, ...titleCondition };
        }

        // Handle price range filtering
        if (startPrice && startPrice !== "undefined" && endPrice && endPrice !== "undefined" && !(startPrice == 0 && endPrice == 0)) {
            if (startPrice == endPrice) {
                // Special handling for exact price match
                if (startPrice == 200000) {
                    condition = {
                        ...condition,
                        [priceField]: {
                            [Op.gte]: startPrice, // Show products priced 25000 or more
                        },
                    };
                } else {
                    condition = {
                        ...condition,
                        [priceField]: startPrice, // Show only exact price match
                    };
                }
            } else {
                // Normal price range
                condition = {
                    ...condition,
                    [priceField]: {
                        [Op.gte]: startPrice,
                        [Op.lte]: endPrice,
                    },
                };
            }
        }

        // Handle price sorting (ascending/descending)
        // if (priceFilter && priceFilter !== "undefined") {
        //     priceFilter == 1
        //         ? order.push([priceField, "ASC"])
        //         : order.push([priceField, "DESC"]);
        // }
        const sellingPriceField = sequelize.literal(
            `COALESCE("trn_offers"."offer_selling_price", "trn_product"."selling_price")`
        );
        const dealerPriceField = sequelize.literal(
            `COALESCE("trn_offers"."offer_dealer_price", "trn_product"."dealer_price")`
        );

        if (priceFilter && priceFilter !== "undefined") {
            if (role === "2") {
                order.push([dealerPriceField, priceFilter == 1 ? "ASC" : "DESC"]);
            } else {
                order.push([sellingPriceField, priceFilter == 1 ? "ASC" : "DESC"]);
            }
        }
        

        if (newestFilter && newestFilter !== "undefined") {
            if (newestFilter === "1") {
                order.push(["createdAt", "DESC"]);
            } else {
                order.push(["id", "ASC"]);
            }
        }

        // Define base includes
        let includes = [
            { model: db.Categories, as: "mst_category", attributes: ["category_name"] },
            { model: db.SubCategories, as: "trn_subcategory", attributes: ["subcategory_name"] },
            { model: db.Brand, attributes: ["brand_name"] },
            { model: db.Model, attributes: ["model_name"] },
        ];

        // Include UserFavourites only if user_id is valid
        if (user_id != 'null' && user_id !== "undefined") {
            includes.push({
                model: db.UserFavourites,
                as: "trn_user_favourites",
                where: { user_id: user_id, product_id: { [Op.col]: "trn_product.id" } },
                required: false,
                attributes: ["id", "user_id", "product_id", "isDelete"],
            });
        }

        includes.push({
            model: db.Offer,
            as: "trn_offers",
            required: offerFilter == "1", // Required only when offerFilter is "1"
            attributes: ["id", "product_id", "offer_selling_price", "offer_dealer_price"],
        });

        // Fetch products with conditions, order, and includes
        return await db.Products.findAll({
            where: condition,
            attributes: { exclude: ["updatedAt", "isDelete"] },
            order: order,
            include: includes,
        });
    } catch (error) {
        throw new Error(`Failed to fetch product list: ${error.message} (title: ${title}, user_id: ${user_id}, priceFilter: ${priceFilter}, newestFilter: ${newestFilter})`);
    }
};

exports.filterProductsList = async (data) => {
    try {
        let whereCondition = { isDelete: false };
        let condition = {};
        let order = [];

        const priceField = data.role === "2" ? "dealer_price" : "selling_price";

        // Basic filters
        if (data.role !== "0" || (data.role == "0" && data.subcategory_id !== 'null' && data.category_id !== 'null')) whereCondition.prd_status = 1;
        if (data.subcategory_id && data.subcategory_id !== 'null' && data.subcategory_id !== '0') whereCondition.subcategory_id = data.subcategory_id;
        if (data.category_id && data.category_id !== 'null' && data.category_id !== '0') whereCondition.category_id = data.category_id;

        if (data.title && data.title !== "undefined") {
            const titleLower = data.title.toLowerCase();
            const titleCondition = {
                [Op.or]: [
                    sequelize.where(sequelize.fn("LOWER", sequelize.col("prd_title")), "LIKE", `%${titleLower}%`),
                    sequelize.where(sequelize.fn("LOWER", sequelize.col("prd_description")), "LIKE", `%${titleLower}%`),
                    sequelize.where(sequelize.fn("LOWER", sequelize.col("mst_brand.brand_name")), { [Op.like]: `%${titleLower}%` }),
                    sequelize.where(sequelize.fn("LOWER", sequelize.col("mst_model.model_name")), { [Op.like]: `%${titleLower}%` }),
                    sequelize.where(sequelize.fn("LOWER", sequelize.col("mst_category.category_name")), { [Op.like]: `%${titleLower}%` }),
                    sequelize.where(sequelize.fn("LOWER", sequelize.col("trn_subcategory.subcategory_name")), { [Op.like]: `%${titleLower}%` }),
                ],
            };
            whereCondition = { ...whereCondition, ...titleCondition };
        }
        const sellingPriceField = sequelize.literal(
            `COALESCE("trn_offers"."offer_selling_price", "trn_product"."selling_price")`
        );
        const dealerPriceField = sequelize.literal(
            `COALESCE("trn_offers"."offer_dealer_price", "trn_product"."dealer_price")`
        );

        if (data.priceFilter && data.priceFilter !== "undefined") {
            if (data.role === "2") {
                order.push([dealerPriceField, data.priceFilter == 1 ? "ASC" : "DESC"]);
            } else {
                order.push([sellingPriceField, data.priceFilter == 1 ? "ASC" : "DESC"]);
            }
        }
        
        if (data.newestFilter === "1") order.push(["createdAt", "DESC"]);
        else order.push(["id", "ASC"]);

        // Include relationships
        let includes = [
            { model: db.Categories, as: "mst_category", attributes: ["category_name"] },
            { model: db.SubCategories, as: "trn_subcategory", attributes: ["subcategory_name"] },
            { model: db.Brand, attributes: ["brand_name"] },
            { model: db.Model, attributes: ["model_name"] },
            {
                model: db.ProductFields,
                as: "mst_product_fields",
                attributes: ["prd_col_id", "field_value"]
            },
        ];

        if (data.user_id != 'null') {
            includes.push({
                model: db.UserFavourites,
                as: "trn_user_favourites",
                where: { user_id: data.user_id, product_id: { [Op.col]: "trn_product.id" } },
                required: false,
                attributes: ["id", "user_id", "product_id", "isDelete"],
            });
        }

        includes.push({
            model: db.Offer,
            as: "trn_offers",
            required: data.offerFilter == "1", // Required only when offerFilter is "1"
            attributes: ["id", "product_id", "offer_selling_price", "offer_dealer_price"],
        });

        let filters = [];
        try {
            filters = Array.isArray(data.filters) ? data.filters : JSON.parse(data.filters || "[]");
        } catch (e) {
            console.error("Failed to parse filters:", e);
            filters = [];
        }

        let priceRangeFilter = filters.find((f) => f.id === "priceRange");

        if (priceRangeFilter) {
            const [startValue, endValue] = priceRangeFilter.value.split("-").map(Number);

            whereCondition[priceField] =
                startValue === endValue
                    ? startValue === 200000
                        ? { [Op.gte]: startValue }
                        : startValue
                    : { [Op.gte]: startValue, [Op.lte]: endValue };

            // Remove priceRange from other filters
            filters = filters.filter((f) => f.id !== "priceRange");
        }

        if ((filters.length == 1 && filters[0].id == "priceRange") || filters.length == 0) {
            return await db.Products.findAll({
                where: whereCondition,
                order: order,
                include: includes,
            });
        }


        // First, fetch products matching the basic where conditions
        const initialProducts = await db.Products.findAll({
            where: whereCondition,
            attributes: ['id'],
            order: order,
            include: includes,
        });

        const productIds = initialProducts.map(p => p.id);

        try {
            filters = Array.isArray(data.filters)
                ? data.filters
                : JSON.parse(data.filters || "[]");
        } catch (e) {
            console.error("Failed to parse filters:", e);
            filters = [];
        }

        if (filters.length > 0 && productIds.length > 0) {
            let filterConditions = filters.map((f) => {
                if (f.id != "priceRange") {
                    const startValue = parseFloat(f.value.split("-")[0]);
                    const endValue = parseFloat(f.value.split("-")[1]);

                    if (!isNaN(startValue) && !isNaN(endValue)) {
                        // Handle numeric ranges in string field_value
                        return {
                            prd_col_id: f.id,
                            [Op.or]: [
                                sequelize.literal(`"mst_product_fields"."field_value" = '${startValue}'`),  // Exact start value match
                                sequelize.literal(`"mst_product_fields"."field_value" = '${endValue}'`),    // Exact end value match
                                sequelize.literal(`
                                CASE 
                                    WHEN "mst_product_fields"."field_value" ~ '^\\d+(\\.\\d+)?$' 
                                    THEN CAST("mst_product_fields"."field_value" AS NUMERIC) 
                                    ELSE NULL 
                                END BETWEEN ${startValue} AND ${endValue}
                            `),  // Values between start and end
                            ],
                            prd_id: { [Op.in]: productIds },
                        };
                    } else {
                        // Default string matching for non-numeric values
                        return {
                            prd_col_id: f.id,
                            field_value: { [Op.like]: `%${f.value.trim()}%` },
                            prd_id: { [Op.in]: productIds },
                        };
                    }
                }
            });

            const nonPriceRangeFilters = filters.filter(f => f.id !== "priceRange");

            const productMatches = await db.ProductFields.findAll({
                attributes: ['prd_id'],
                where: { [Op.or]: filterConditions },
                group: ['prd_id'],
                having: db.sequelize.literal(`COUNT(DISTINCT prd_col_id) = ${nonPriceRangeFilters.length}`)
            });

            const matchedProductIds = productMatches.map(pm => pm.prd_id);

            // Refine the main product list to only those matching all filters
            condition.id = { [Op.in]: matchedProductIds };
        }

        // Final product list fetch with includes and sorting
        const products = await db.Products.findAll({
            where: condition,
            order: order,
            include: includes,
        });

        return products;
    } catch (error) {
        throw new Error("Failed to fetch product list: " + error.message);
    }
};