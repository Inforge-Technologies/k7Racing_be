module.exports = (sequelize, DataTypes) => {
    const Color = sequelize.define('mst_colors', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        color: {
            type: DataTypes.STRING,
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    });
    return Color;
}
