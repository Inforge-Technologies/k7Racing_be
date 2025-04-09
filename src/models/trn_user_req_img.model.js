module.exports = (sequelize, DataTypes) => {
    const user_req_images = sequelize.define("trn_usr_req_img", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        usr_req_id: {
            type: DataTypes.INTEGER
        },
        img_path: {
            type: DataTypes.STRING
        },
    });
    return user_req_images;
};