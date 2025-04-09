module.exports = (sequelize, DataTypes) => {
    const UserFavourites = sequelize.define("trn_user_favourites", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        product_id: {
            type: DataTypes.INTEGER
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

    });
    return UserFavourites;
};