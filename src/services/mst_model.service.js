const db = require("../config/dbconfig");

exports.getModelList = async (data) => {
  try {
    const modelList = await db.Model.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      where:{
        category_id: data.category_id,
        subcategory_id:data.subcategory_id,
        brand_id: data.brand_id
      },
      order: [
        ['id', 'ASC']
      ],
    });
    return modelList;
  } catch (error) {
    throw new Error("Failed to fetch model list" + error.message);
  }
}