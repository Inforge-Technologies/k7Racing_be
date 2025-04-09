module.exports = (sequelize, DataTypes) => {
    const SubCategories = sequelize.define("trn_subcategories", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        subcategory_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subcategory_description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
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
    return SubCategories;
}
