module.exports = (sequelize, DataTypes) => {
    const Offer = sequelize.define("trn_offer", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        offer_selling_price: {
            type: DataTypes.FLOAT
        },
        offer_dealer_price: {
            type: DataTypes.FLOAT
        },
    });
    return Offer;
};