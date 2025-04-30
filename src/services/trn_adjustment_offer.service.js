const db = require("../config/dbconfig");

exports.saveAdjustmentOffer = async (offerData) => {
  try {
    const existingAdjustmentOfferDetails = await db.AdjustmentOffer.findOne({
      where: { prd_id: offerData.prd_id, user_id: offerData.user_id }
    });

    if (existingAdjustmentOfferDetails) {
       await db.AdjustmentOffer.update(offerData, {
        where: { prd_id: offerData.prd_id, user_id: offerData.user_id }
      });

      return {
        status: "Success",
        message: "Adjustment offer details updated successfully.",
        data:existingAdjustmentOfferDetails.id,
      };
    } else {
      var data = await db.AdjustmentOffer.create(offerData);

      return {
        status: "Success",
        message: "Adjustment offer details saved successfully.",
        data:data.id,
      };
    }
  } catch (error) {
    throw new Error("Failed to save adjustment offer details: " + error.message);
  }
};

exports.findOneAdjustmentOffer = async (data) => {
  try {
      const offer = await db.AdjustmentOffer.findOne({
          where: {
            prd_id: data.prd_id,
            user_id: data.user_id
          },
          attributes: {
              exclude: ["createdAt","updatedAt","prd_id","user_id","offer_date","isDelete"], // "createdAt", "updatedAt"
          },
      });
      return offer;
  } catch (error) {
      throw new Error("Failed to find adjustment offer data: " + error.message);
  }
};

exports.getAdjustmentOfferById = async (id) => {
    try {
        const offer = await db.AdjustmentOffer.findAll({
            where: {
              prd_id: id
            },
            attributes: {
                exclude: ["createdAt","updatedAt","isDelete"], 
            },
            include: [
              {
                model: db.Products,
                as: 'trn_product', 
                attributes: [
                  'id', 'dealer_price', 'selling_price', "prd_title"
                ]
              },
              {
                model: db.Login,
                as: 'trn_login',
                attributes: [
                  'id', 'fullname', 'mobile_no', 'email', 'role_id'
                ]
              }
            ]
        });
        return offer;
    } catch (error) {
        throw new Error("Failed to find offer data by ID: " + error.message);
    }
};