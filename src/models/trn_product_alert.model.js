module.exports = (sequelize, DataTypes) => {
    const ProductAlert = sequelize.define('trn_product_alert', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
        },
        subcategory_id: {
            type: DataTypes.INTEGER,
        },
        brand_id: {
            type: DataTypes.INTEGER
        },
        model_id: {
            type: DataTypes.INTEGER,
        },
        start_range: {
            type: DataTypes.INTEGER
        },
        end_range: {
            type: DataTypes.INTEGER
        },
        login_id: {
            type: DataTypes.INTEGER
        }
    });
    return ProductAlert;
}
