module.exports = (sequelize, DataTypes) => {
    const trn_user_req = sequelize.define("trn_user_req", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        sub_cat_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        budget: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sub_cat_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        prd_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        buysell: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        model_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        wa_user: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

    });
    return trn_user_req;
};