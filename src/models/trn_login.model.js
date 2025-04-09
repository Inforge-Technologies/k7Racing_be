module.exports = (sequelize, DataTypes) => {
    const Login = sequelize.define("trn_login", {
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
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        role_id: {
            type: DataTypes.INTEGER
        },
    });
    return Login;
}