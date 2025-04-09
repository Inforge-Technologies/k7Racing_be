module.exports = (sequelize, DataTypes) => {
    const trn_wa_user = sequelize.define("trn_wa_user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        user_wa_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobile_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return trn_wa_user;
};