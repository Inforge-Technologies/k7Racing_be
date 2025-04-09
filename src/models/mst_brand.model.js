module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define("mst_brand", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        brand_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        logo_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Brand;
};