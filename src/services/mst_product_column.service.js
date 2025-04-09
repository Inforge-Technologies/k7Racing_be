const db = require("../config/dbconfig");

exports.productColumnCreate = async (data) => {
  try {
    const existingProductColumn = await db.ProductColumns.findOne({
      where: {
        field: data.field,
        type: data.type,
      },
    });

    if (!existingProductColumn) {
      if (data.default_value == "") {
        data.default_value = null;
      }
      if (data.target_limit == "") {
        data.target_limit = null;
      }
      await db.ProductColumns.create(data);
      return {
        status: "Success",
        message: `${data.field} field is saved successfully`,
      };
    } else {
      return { status: "Error", message: `${data.field} Already Exist` };
    }
  } catch (error) {
    throw new Error("Failed to save field: " + error.message);
  }
};


exports.getFieldsList = async (data) => {
  try {
    const fieldsList = await db.ProductColumns.findAll({
      attributes: {
        include: ['id', 'field']
      },
      where: {
        isDelete: false,
      },

    });
    return fieldsList;
  } catch (error) {
    throw new Error("Failed to fetch fields list" + error.message);
  }
}