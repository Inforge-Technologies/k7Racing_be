const db = require("../config/dbconfig");
const fs = require("fs");
const path = require("path");
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;
const sharp = require('sharp');
const mime = require('mime-types');

exports.saveUserReq = async (req, res) => {
  try {

    await db.trn_user_req.create(req).then((save) => {
      return res.send({
        status: "Success",
        message: save.id + " " + "-Data is saved successfully",
      });
    });

  } catch (error) {
    throw new Error("Failed to save user Request: " + error.message);
  }
};

exports.saveReqProduct = async (productData, fieldData, files, id) => {
    const transaction = await db.sequelize.transaction();

    try {

        const imgPath = `${process.env.protocol}${process.env.domain}`;
      

        let product;
        product = await db.trn_user_req.create(
          {
              category_id: productData.category_id,
              sub_cat_id: productData.sub_cat_id != 'null' ? productData.sub_cat_id : null,
              brand_id:productData.brand_id,
              model_id:productData.model_id,
              user: productData.user,
              buysell: 2
          },
          { transaction }
      );
        const productId = product.id;

        for (const field of fieldData) {
          await db.SellPrdFields.create(
            {
                usr_req_id: productId,
                prd_col_id: field.prd_col_id,
                field_value: field.field_value,
            },
            { transaction }
        );
        }

        for (let i = 0; i < files.length; i++) {
            const productImagePath = await saveImage(files[i], imgPath, "userProducts", `product_${Date.now()}`);
            await db.user_req_images.create(
              {
                  usr_req_id: productId,
                  img_path: productImagePath
              },
              { transaction }
          );
        }

        await transaction.commit();
        return product.id;
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

exports.updateUserType = async (data) => {
  try {
    const result = await db.trn_wa_user.update(
      { buysell: data.buysell },
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

exports.getAllUserRequests = async () => {
  try {
    const userRequests = await db.trn_user_req.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "isDelete"],
      },
      where: {
        isDelete: false,
      },
      include: [
        {
          model: db.trn_wa_user,
          attributes: ["id", "mobile_no"],
          required: false,
        },
        {
          model: db.Login,
          attributes: ["id", "mobile_no"],
          required: false,
        },
      ],
    });

    for (const request of userRequests) {
      if (request.buysell === 2) {
        if (request.model_id) {
          request.dataValues.mst_model = await db.Model.findOne({
            where: { id: request.model_id },
            attributes: ["id", "model_name"],
          });
        }

        request.dataValues.userFields = await db.SellPrdFields.findAll({
          where: { usr_req_id: request.id },
          attributes: ["id", "prd_col_id", "usr_req_id", "field_value"],
          include: [
            {
              model: db.SellPrdCol,
              attributes: ["id", "field", "sort_order"],
              order: [["sort_order", "ASC"]],
              required: false,
            },
          ],
        });

        request.dataValues.userImages = await db.user_req_images.findAll({
          where: { usr_req_id: request.id },
          attributes: ["id", "usr_req_id", "img_path"],
          order: [["id", "ASC"]],
        });

      } else if (request.buysell === 1 && request.prd_id) {
        request.dataValues.mst_product = await db.Products.findOne({
          where: { id: request.prd_id },
          
          attributes: {
            exclude: ["createdAt", "updatedAt", "isDelete"],
          },
          include: [
            {
              model: db.ProductFields,
              attributes: ["id", "prd_id", "field_value"],
              include: [
                {
                  model: db.ProductColumns,
                  attributes: ["id", "field"],
                  required: false,
                },
              
              ],
              required: false,
            },
            {
              model: db.Model,
              attributes: ["id", "model_name"],
              required: false,
            },
             {
                model: db.Login,
                attributes: ["id", "mobile_no"],
                required: false,
            },
          ],
        });
      }
    }

    return userRequests;
  } catch (error) {
    throw new Error("Failed to fetch user list: " + error.message);
  }
};

exports.findAllUserReqByDate = async () => {
  try {
    var today = new Date();
    // var minDate = today.addDays(-10);
    var someDate = new Date();
    var numberOfDaysToAdd = -10;
    var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    const product = await db.trn_user_req.findAll({
      include: [{
        model: db.trn_wa_user,
        attributes: ["user_wa_name", "mobile_no"],
      }],
      where:
      {
        [Op.and]: [
          {
            [Op.or]: [
              {
                createdAt: {
                  [Op.eq]: sequelize.literal(`(SELECT max(tur."createdAt") FROM trn_user_req tur WHERE tur.wa_user = trn_wa_user.id AND tur.buysell = 1)`),
                },
              },
              {
                createdAt: {
                  [Op.eq]: sequelize.literal(`(SELECT  max(tur."createdAt") FROM trn_user_req tur WHERE tur.wa_user = trn_wa_user.id AND tur.buysell = 2)`),
                },
              },
            ],
          },
          {
            createdAt: {
              [Op.between]: [result, today]
            },
          },
        ],
      },
      order: [['createdAt', 'ASC']],

      attributes: {
        exclude: ["createdAt", "updatedAt"], // "createdAt", "updatedAt"
      },
    });
    return product;
  } catch (error) {
    throw new Error("Failed to find Product by ID: " + error.message);
  }
};

exports.findRequestProductById = async (id) => {
    try {
        const reqProduct = await db.trn_user_req.findOne({
            where: {
                id: id,
                isDelete: false,
            },
            attributes: {
                exclude: ["isDelete"], // "createdAt", "updatedAt"
            },
            include: [
                {
                    model: db.Model,
                    attributes: ["id", "model_name"],
                    include: [
                      {
                        model: db.Brand,
                        attributes: ["id", "brand_name"],
                    },
                    ],
                },
            ],
        });
        return reqProduct;
    } catch (error) {
        throw new Error("Failed to find user request product data by ID: " + error.message);
    }
};

exports.getUserReqSellList = async (user) => {
  try {
    const userSellRequests = await db.trn_user_req.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "isDelete"],
      },
      where: {
        user: user,
        isDelete: false,
      },
      include: [
        {
          model: db.Model, 
          attributes: ["id", "model_name"], 
        },
        {
          model: db.SellPrdFields,
          attributes: ["id", "prd_col_id", "usr_req_id", "field_value"],
          include: [
            {
              model: db.SellPrdCol, 
              attributes: ["id", "field"], 
              order: [["sort_order", "ASC"]],
            },
          ]
        },
        {
          model: db.user_req_images, 
          attributes: ["id", "img_path"], 
        },
      ],
    });

    return userSellRequests;
  } catch (error) {
    throw new Error("Failed to fetch user sell request list: " + error.message);
  }
};

exports.deleteUserRequest = async (id) => {
    try {
        const result = await db.trn_user_req.update(
            { isDelete: true },
            { where: { id: id } }
        );
        if (result[0] === 0) {
            throw new Error("User request not found or not deleted");
        }
        return {
            status: "Success",
            message: "User request deleted successfully"
        };
    } catch (error) {
        throw new Error("Failed to delete user request: " + error.message);
    }
};
