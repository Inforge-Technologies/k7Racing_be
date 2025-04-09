const db = require("../config/dbconfig");
const fs = require("fs");
const path = require("path");
const sharp = require('sharp');
const mime = require('mime-types');

// exports.createCategory = async (categoryData, imageUrl, imgPath) => {
//     const transaction = await db.sequelize.transaction();
//     try {
//         // Capitalize category name
//         const categoryName =
//             categoryData.category_name.charAt(0).toUpperCase() +
//             categoryData.category_name.slice(1).toLowerCase();
//         categoryData.category_name = categoryName;

//         // Check if category exists
//         const existingCategory = await db.Categories.findOne({
//             where: {
//                 category_name: categoryData.category_name,
//                 isDelete: false,
//             },
//         });

//         if (existingCategory) {
//             throw new Error("Category already exists");
//         }

//         // Handle image upload
//         if (imageUrl) {
//             const categoryImagePath = await saveImage(
//                 imageUrl,
//                 imgPath,
//                 "categoryImage"
//             );
//             categoryData.image_url = categoryImagePath;
//         }

//         // Create category
//         const category = await db.Categories.create(
//             {
//                 category_name: categoryData.category_name,
//                 category_description: categoryData.category_description,
//                 image_url: categoryData.image_url,
                
                
//             },
//             { transaction }
//         );

//         // Ensure `subcategories` is an array before mapping
//         let subcategories = categoryData.subcategories;
//         if (typeof subcategories === "string") {
//             try {
//                 subcategories = JSON.parse(subcategories);
//             } catch (error) {
//                 throw new Error("Invalid subcategories format");
//             }
//         }

//         if (!Array.isArray(subcategories)) {
//             throw new Error("Subcategories must be an array");
//         }

//         // Map and insert subcategories
//         const subcategoryData = subcategories.map((subcategory) => ({
//             category_id: category.id,
//             subcategory_name: subcategory.subcategory_name,
//             subcategory_description: subcategory.subcategory_description, // Fixed typo
//         }));

//         await db.SubCategories.bulkCreate(subcategoryData, { transaction });

//         // Commit transaction
//         await transaction.commit();
//         return category;
//     } catch (error) {
//         await transaction.rollback();
//         throw new Error("Failed to create category: " + error.message);
//     }
// };


// function saveImage(file, imgPath, uploadDir_) {
//     return new Promise((resolve, reject) => {
//         const uploadDir = path.join(
//             __dirname,
//             "..",
//             "..",
//             "resources",
//             "assets",
//             uploadDir_
//         );

//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true });
//         }
//         const dbSavePath =
//             imgPath +
//             "/" +
//             "resources" +
//             "/" +
//             "assets" +
//             "/" +
//             uploadDir_ +
//             "/" +
//             file.originalname;

//         const imagePath = path.join(
//             __dirname,
//             "..",
//             "..",
//             "resources",
//             "assets",
//             uploadDir_,
//             file.originalname
//         );
//         const fileStream = fs.createWriteStream(imagePath);

//         fileStream.on("open", function (fd) {
//             fileStream.write(file.buffer);
//             fileStream.end(() => {
//                 resolve(dbSavePath);
//             });
//         });

//         fileStream.on("error", function (err) {
//             reject(err);
//         });
//     });
// }

exports.createCategory = async (categoryData, categoryImage, imgPath, files) => {
    const transaction = await db.sequelize.transaction();
    try {
        categoryData.category_name = categoryData.category_name.trim();
        categoryData.category_name =
            categoryData.category_name.charAt(0).toUpperCase() +
            categoryData.category_name.slice(1).toLowerCase();

        // Check if category exists
        const existingCategory = await db.Categories.findOne({
            where: { category_name: categoryData.category_name, isDelete: false },
        });

        if (existingCategory) {
            throw new Error("Category already exists");
        }

        // Save category image if provided
        if (categoryImage) {
            const categoryImagePath = await saveImage(categoryImage, imgPath, "categoryImage", `category_${Date.now()}`);
            categoryData.image_url = categoryImagePath;
        }

        // Create category
        const category = await db.Categories.create(
            {
                category_name: categoryData.category_name,
                category_description: categoryData.category_description,
                image_url: categoryData.image_url,
            },
            { transaction }
        );

        // Ensure `subcategories` is an array
        let subcategories = categoryData.subcategories;
        if (typeof subcategories === "string") {
            subcategories = JSON.parse(subcategories);
        }
        if (!Array.isArray(subcategories)) {
            throw new Error("Subcategories must be an array");
        }

        if (subcategories.length === 0) {
            await transaction.commit();
            return category;
        }

        // Process subcategory images
        const subcategoryData = await Promise.all(subcategories.map(async (subcategory, index) => {
            let subcategoryImagePath = null;

            const subcategoryImage = files[index + 1];

            if (subcategoryImage) {
                subcategoryImagePath = await saveImage(subcategoryImage, imgPath, "subcategoryImage", `subcategory_${Date.now()}`);
            }

            return {
                category_id: category.id,
                subcategory_name: subcategory.subcategory_name,
                subcategory_description: subcategory.subcategory_description,
                image_url: subcategoryImagePath, // Save subcategory image path
            };
        }));

        // Save subcategories with images
        await db.SubCategories.bulkCreate(subcategoryData, { transaction });

        // Commit transaction
        await transaction.commit();
        return category;
    } catch (error) {
        await transaction.rollback();
        throw new Error("Failed to create category: " + error.message);
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


exports.getAllCategories = async (data) => {
    try {
        const categoriesList = await db.Categories.findAll({
            attributes: {
                exclude: ['isDelete', 'createdAt', 'updatedAt']
            },
            where: {
               isDelete: false,
            },
            order: [
                ['id', 'ASC']
            ],

        });
        return categoriesList;
    } catch (error) {
        throw new Error("Failed to featch categories list" + error.message);
    }
}