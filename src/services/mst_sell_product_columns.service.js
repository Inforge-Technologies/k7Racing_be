const db = require("../config/dbconfig");
const fs = require("fs");
const path = require("path");


exports.getColumnList = async () => {
  try {
    const brandList = await db.SellPrdCol.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      order: [
        ['sort_order', 'ASC']
      ],
    });
    return brandList;
  } catch (error) {
    throw new Error("Failed to fetch brand list" + error.message);
  }
}


