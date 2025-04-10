module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('trn_product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        reg_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
        },
        subcategory_id: {
            type: DataTypes.INTEGER,
        },
        brand_id: {
            type: DataTypes.INTEGER
        },
        model_id: {
            type: DataTypes.INTEGER,
        },
        prd_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prd_description: {
            type: DataTypes.TEXT,
        },
        // prd_type: {
        //     type: DataTypes.INTEGER,
        // },
        longitude: {
            type: DataTypes.FLOAT,
        },
        latitude: {
            type: DataTypes.FLOAT,
        },
        post_date: {
            type: DataTypes.DATEONLY
        },
        posted_by: {
            type: DataTypes.INTEGER
        },
        purchase_price: {
            type: DataTypes.FLOAT
        },
        selling_price: {
            type: DataTypes.FLOAT
        },
        dealer_price: {
            type: DataTypes.FLOAT
        },
        down_payment: {
            type: DataTypes.FLOAT
        },
        tax: {
            type: DataTypes.INTEGER
        },
        cover_image: {
            type: DataTypes.STRING,
        },
        rcimage: {
            type: DataTypes.STRING,
        },
        // km_driven: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        // },
        // no_of_owners: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        // },
        color_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        youtube_link: {
            type: DataTypes.STRING,
        },
        fb_link: {
            type: DataTypes.STRING,
        },
        insta_link: {
            type: DataTypes.STRING,
        },
        sort_order: {
            type: DataTypes.INTEGER,
        },
        prd_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        purchased_from: {
            type: DataTypes.STRING,
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    });
    return Product;
}