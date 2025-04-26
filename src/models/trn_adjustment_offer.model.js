module.exports = (sequelize, DataTypes) => {
    const adjustmentModel = sequelize.define('trn_adjustment_offer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        prd_id: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        offer: {
            type: DataTypes.FLOAT
        },
        offer_date:{
            type: DataTypes.DATEONLY
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    });
    return adjustmentModel
}