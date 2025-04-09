const db = require("../config/dbconfig");
const fs = require("fs");
const path = require("path");
const sharp = require('sharp');
const mime = require('mime-types');

exports.saveBrand = async (
  brandData,
  photoUrl,
  imgPath
) => {
  try {
    const existingBranch = await db.Brand.findOne({
      where: {
        brand_name: brandData.brand_name,
      },
    });

    const photoImageFile = "photoImage";
    if (photoUrl) {
      const brandImagePath = await saveImage(
        photoUrl,
        imgPath,
        photoImageFile,
        `brand_${Date.now()}`
      );
      brandData.logo_url = brandImagePath;
    }

    if (!existingBranch) {
      await db.Brand.create(brandData);
      return {
        status: "Success",
        message: `${brandData.brand_name} brand is saved successfully`,
      };
    } else {
      return { status: "Error", message: `${brandData.brand_name} Already Exist` };
    }
  } catch (error) {
    throw new Error("Failed to save brand: " + error.message);
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

exports.getBrandList = async () => {
  try {
    const brandList = await db.Brand.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      order: [
        ['id', 'ASC']
      ],
    });
    return brandList;
  } catch (error) {
    throw new Error("Failed to fetch brand list" + error.message);
  }
}