const db = require("../config/dbconfig");

exports.saveOfferDetails = async (offerData) => {
  try {
    const existingOfferDetails = await db.Offer.findOne({
      where: { product_id: offerData.product_id }
    });

    if (existingOfferDetails) {
      await db.Offer.update(offerData, {
        where: { product_id: offerData.product_id }
      });

      return {
        status: "Success",
        message: "Offer details updated successfully."
      };
    } else {
      await db.Offer.create(offerData);

      return {
        status: "Success",
        message: "Offer details saved successfully."
      };
    }
  } catch (error) {
    throw new Error("Failed to save offer details: " + error.message);
  }
};

exports.findOfferById = async (id) => {
    try {
        const offer = await db.Offer.findOne({
            where: {
              product_id: id
            },
            attributes: {
                exclude: ["createdAt","updatedAt"], // "createdAt", "updatedAt"
            },
        });
        return offer;
    } catch (error) {
        throw new Error("Failed to find offer data by ID: " + error.message);
    }
};
