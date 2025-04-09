module.exports = (sequelize, DataTypes) => {
    const Product_images = sequelize.define("mst_prd_images", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        prd_id: {
            type: DataTypes.INTEGER
        },
        image_url: {
            type: DataTypes.STRING
        },
    });
    return Product_images;
};