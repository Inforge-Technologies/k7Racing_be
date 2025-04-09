const db = require("../config/dbconfig");
const fs = require("fs");
const path = require("path");

exports.saveSoldDetails = async (soldDetails, aadharUrl, imgPath) => {
    const transaction = await db.sequelize.transaction();

    try {
        const existingSoldDetails = await db.SoldDetails.findOne({
            where: { product_id: soldDetails.product_id },
            transaction,
        });

        const existingUser = await db.trn_wa_user.findOne({
            where: { mobile_no: `91${soldDetails.mobile_no}` },
            transaction,
        });

        const aadharImageFile = "aadharImage";
        if (aadharUrl) {
            const aadharImagePath = await saveImage(aadharUrl, imgPath, aadharImageFile);
            soldDetails.aadhar = aadharImagePath;
        }

        if (!existingSoldDetails) {
            await db.SoldDetails.create(soldDetails, { transaction });

            if (!existingUser) {
                await db.trn_wa_user.create(
                    {
                        mobile_no: `91${soldDetails.mobile_no}`,
                        user_wa_name: soldDetails.fullname,
                    },
                    { transaction }
                );
            }

            // **Update product status to true**
            await db.Products.update(
                { prd_status: 3 },
                { where: { id: soldDetails.product_id }, transaction }
            );

            await transaction.commit(); // Commit transaction if everything succeeds

            return {
                status: "Success",
                message: `Sold details saved successfully.`,
            };
        } else {
            await transaction.rollback(); // Rollback in case of duplicate entry
            return { status: "Error", message: `Sold details already exist` };
        }
    } catch (error) {
        await transaction.rollback(); // Rollback in case of any error
        throw new Error("Failed to save sold details: " + error.message);
    }
};

function saveImage(file, imgPath, uploadDir_) {
    return new Promise((resolve, reject) => {
        const uploadDir = path.join(
            __dirname,
            "..",
            "..",
            "resources",
            "assets",
            uploadDir_
        );

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const dbSavePath =
            imgPath +
            "/" +
            "resources" +
            "/" +
            "assets" +
            "/" +
            uploadDir_ +
            "/" +
            file.originalname;

        const imagePath = path.join(
            __dirname,
            "..",
            "..",
            "resources",
            "assets",
            uploadDir_,
            file.originalname
        );
        const fileStream = fs.createWriteStream(imagePath);

        fileStream.on("open", function (fd) {
            fileStream.write(file.buffer);
            fileStream.end(() => {
                resolve(dbSavePath);
            });
        });

        fileStream.on("error", function (err) {
            reject(err);
        });
    });
}

exports.getSoldProductsList = async (
    page,
    size,
    title
) => {
    try {
        var condition = { isDelete: false };
        const { limit, offset } = getPagination(page, size);
        const soldProductList = await db.SoldDetails.findAndCountAll({
            limit,
            offset,
            where: condition,
            order: [["id", "DESC"]],
            attributes: {
                exclude: ["createdAt", "updatedAt", "isDelete"], // "createdAt", "updatedAt"
            },
            include: [
                {
                    model: db.Products,
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "isDelete"], // "createdAt", "updatedAt"
                    },
                },
            ],
        });

        return getPagingData(soldProductList, page, limit);
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
    const { count: totalElements, rows: soldProductList } = data;
    const pageNumber = page ? +page : 0;
    const totalPages = Math.ceil(totalElements / limit);
    return { totalElements, soldProductList, totalPages, pageNumber };
};