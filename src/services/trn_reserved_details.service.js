const db = require("../config/dbconfig");

exports.saveReservedDetails = async (reservedData) => {
    const transaction = await db.sequelize.transaction();

    try {
        const existingReservedDetails = await db.ReservedDetails.findOne({
            where: { product_id: reservedData.product_id },
            transaction,
        });

        const existingUser = await db.trn_wa_user.findOne({
            where: { mobile_no: `91${reservedData.mobile_no}` },
            transaction,
        });

        if (!existingReservedDetails) {
            await db.ReservedDetails.create(reservedData, { transaction });

            if (!existingUser) {
                await db.trn_wa_user.create(
                    {
                        mobile_no: `91${reservedData.mobile_no}`,
                        user_wa_name: reservedData.fullname,
                    },
                    { transaction }
                );
            }


            await db.Products.update(
                { prd_status: 2 },
                { where: { id: reservedData.product_id }, transaction }
            );

            await transaction.commit();

            return {
                status: "Success",
                message: `Reserved details saved successfully.`,
            };
        } else {
            await transaction.rollback();
            return { status: "Error", message: `Resserved details already exist` };
        }
    } catch (error) {
        await transaction.rollback();
        throw new Error("Failed to save reserved details: " + error.message);
    }
};