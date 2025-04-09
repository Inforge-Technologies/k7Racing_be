module.exports = (sequelize, DataTypes) => {
    const CustomFields = sequelize.define("mst_custom_fields", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        subcategory_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        prd_col_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        
    });
    return CustomFields;
};