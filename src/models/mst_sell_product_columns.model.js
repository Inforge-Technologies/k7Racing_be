module.exports = (sequelize, DataTypes) => {
    const product_columns = sequelize.define("mst_sell_product_columns", {
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
        sort_order: {
            type: DataTypes.INTEGER,
        },
        points: {
            type: DataTypes.INTEGER,
        },
        default_value: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_mandatory: {
            type: DataTypes.BOOLEAN,
        },
        allow_in_filter: {
            type: DataTypes.BOOLEAN,
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });
    return product_columns;
};