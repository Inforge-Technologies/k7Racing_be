const db = require("../config/dbconfig");

exports.productAlertCreate = async (data) => {
    try {
      const existingProductAlert = await db.ProductAlert.findOne({
        where: {
            category_id: data.category_id,
            subcategory_id: data.subcategory_id,
            brand_id: data.brand_id,
            model_id: data.model_id,
            login_id: data.login_id
        },
      });
  
      if (!existingProductAlert) {
        await db.ProductAlert.create(data);
        return {
          status: "Success",
          message: `Alert saved successfully`,
        };
      } else {
        return { status: "Error", message: `Alert already exist` };
      }
    } catch (error) {
      throw new Error("Failed to save alert: " + error.message);
    }
  };