module.exports = (sequelize, DataTypes) => {
    const Categories = sequelize.define("mst_categories", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category_description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image_url: {
            type: DataTypes.STRING
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        
    });
    return Categories;
};