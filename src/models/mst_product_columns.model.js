module.exports = (sequelize, DataTypes) => {
    const product_columns = sequelize.define("mst_product_columns", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        field: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.INTEGER,
        },
        default_value: {
            type: DataTypes.TEXT
        },
        is_mandatory: {
            type: DataTypes.BOOLEAN,
        },
        allow_in_filter: {
            type: DataTypes.BOOLEAN,
        },
        target_limit: {
            type: DataTypes.INTEGER,
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        
    });
    return product_columns;
};