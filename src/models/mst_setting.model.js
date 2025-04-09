module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define("mst_setting", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        company_name: {
            type: DataTypes.STRING,
        },
        logo_path: {
            type: DataTypes.STRING,
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });
    return Setting;
};