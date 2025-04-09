module.exports = (sequelize, DataTypes) => {
    const Product_fields = sequelize.define('mst_sell_product_fields', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        prd_col_id: {
            type: DataTypes.INTEGER
        },
        usr_req_id: {
            type: DataTypes.INTEGER
        },
        field_value: {
            type: DataTypes.STRING
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    });
    return Product_fields
}