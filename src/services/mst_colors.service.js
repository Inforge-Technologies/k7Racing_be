const db = require("../config/dbconfig");

exports.findAllColors = async () => {
     try {
        const colorsList = await db.Color.findAll({
            where :{isDelete : false} ,
          attributes: {
            exclude: ['isDelete','createdAt', 'updatedAt']
          },
          order: [
            ['id', 'ASC']
          ],
        });
        return colorsList;
      } catch (error) {
        throw new Error("Failed to fetch colors list" + error.message);
      }
}