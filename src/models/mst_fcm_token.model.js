module.exports = (sequelize, DataTypes) => {
    const FcmToken = sequelize.define("mst_fcm_token", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      fcm_token: {
        type: DataTypes.STRING,
      },
      login_id: {
        type: DataTypes.INTEGER,
      },
      isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      platform : {
        type: DataTypes.STRING,
      },
    });
    return FcmToken;
  };
  