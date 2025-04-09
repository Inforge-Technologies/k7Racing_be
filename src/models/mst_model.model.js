module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define("mst_model", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        brand_id: {
            type: DataTypes.INTEGER
        },
        model_name: {
            type: DataTypes.STRING
        },
        category_id: {
            type: DataTypes.INTEGER
        },
        subcategory_id: {
            type: DataTypes.INTEGER
        },
        max_price:{
            type: DataTypes.INTEGER
        }

    });
    return Model;
};