module.exports = (sequelize, DataTypes) => {
    const soldDetails = sequelize.define("trn_sold_details", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fullname: {
            type: DataTypes.STRING
        },
        mobile_no: {
            type: DataTypes.STRING
        },
        aadhar: {
            type: DataTypes.STRING
        },
        product_id: {
            type: DataTypes.INTEGER
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    });
    return soldDetails;
}