const config = require("./config");
const fs = require("fs");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  config.database.database,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    dialect: "postgres",
    port: config.database.port,
    // Dont remove these lines. needed for production release
     ssl: {
	 rejectUnauthorized: false,
   	 ca: fs.readFileSync('/etc/ssl/certs/api/certificate.crt').toString(),
	key:  fs.readFileSync('/etc/ssl/certs/api/private.key').toString(),
	cert:   fs.readFileSync('/etc/ssl/certs/api/certificate.crt').toString(),
     },

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle,
    },
    define: {
      freezeTableName: true,
      raw: true,
    },
  }
);
sequelize
  .authenticate()
  .then(() => {
    console.log("Database synchronized successfully.");
    sequelize
      .sync({ alter: true })
      .then(() => {
        console.log("Database synchronized successfully.");
      })
      .catch((error) => {
        console.error("Error synchronizing database:", error);
      });
  })
  .catch((err) => {
    console.log("Database Not synchronized successfully.");

  console.log(err.message);
 
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Setting = require('../models/mst_setting.model')(sequelize, DataTypes);
db.Categories = require("../models/mst_categories.model")(sequelize, DataTypes);
db.SubCategories = require("../models/trn_subcategories.model")(sequelize, DataTypes);
db.Products = require("../models/trn_product.model")(sequelize, DataTypes);
db.ProductColumns = require('../models/mst_product_columns.model')(sequelize, DataTypes);
db.ProductFields = require("../models/mst_product_fields.model")(sequelize, DataTypes);
db.ProductImage = require("../models/mst_product_imgaes.model")(sequelize, DataTypes);
db.Brand = require("../models/mst_brand.model")(sequelize, DataTypes);
db.CustomFields = require("../models/mst_custom_fields.model")(sequelize, DataTypes);
db.trn_wa_user = require("../models/trn_wa_user.model")(sequelize, DataTypes);
db.Model = require("../models/mst_model.model")(sequelize, DataTypes);
db.SellPrdCol = require("../models/mst_sell_product_columns.model")(sequelize, DataTypes);
db.SellPrdFields = require("../models/mst_sell_product_fields.model")(sequelize, DataTypes);
db.trn_user_req = require("../models/trn_user_req.model")(sequelize, DataTypes);
db.user_req_images = require("../models/trn_user_req_img.model")(sequelize, DataTypes);
db.Login = require("../models/trn_login.model")(sequelize, DataTypes);
db.SoldDetails = require("../models/trn_sold_details.model")(sequelize, DataTypes);
db.UserFavourites = require("../models/trn_user_favourites.model")(sequelize, DataTypes);
db.ReservedDetails = require("../models/trn_reserved_details.model")(sequelize, DataTypes);
db.Offer = require("../models/trn_offer.model")(sequelize, DataTypes);
db.FcmToken = require("../models/mst_fcm_token.model")(sequelize, DataTypes);
db.ProductAlert = require("../models/trn_product_alert.model")(sequelize, DataTypes);
db.Color = require("../models/mst_colors.model")(sequelize, DataTypes);

// Product association
db.Categories.hasMany(db.Products, { foreignKey: "category_id" });
db.Products.belongsTo(db.Categories, { foreignKey: "category_id" });

db.Login.hasMany(db.Products, { foreignKey: "posted_by" });
db.Products.belongsTo(db.Login, { foreignKey: "posted_by" });

db.Brand.hasMany(db.Products, { foreignKey: "brand_id" });
db.Products.belongsTo(db.Brand, { foreignKey: "brand_id" });

db.Model.hasMany(db.Products, { foreignKey: "model_id" });
db.Products.belongsTo(db.Model, { foreignKey: "model_id" });

db.SubCategories.hasMany(db.Products, { foreignKey: "subcategory_id" });
db.Products.belongsTo(db.SubCategories, { foreignKey: "subcategory_id" }); 

db.Color.hasMany(db.Products, { foreignKey: "color_id" });
db.Products.belongsTo(db.Color, { foreignKey: "color_id" });

// SubCategories association
db.Categories.hasMany(db.SubCategories, { foreignKey: "category_id" });
db.SubCategories.belongsTo(db.Categories, { foreignKey: "category_id" });

// Product_image association
db.Products.hasMany(db.ProductImage, { foreignKey: "prd_id" });
db.ProductImage.belongsTo(db.Products, { foreignKey: "prd_id" });

// Product_fields association
db.ProductColumns.hasMany(db.ProductFields, { foreignKey: "prd_col_id" });
db.ProductFields.belongsTo(db.ProductColumns, { foreignKey: "prd_col_id" });

db.Products.hasMany(db.ProductFields, { foreignKey: "prd_id" });
db.ProductFields.belongsTo(db.Products, { foreignKey: "prd_id" });

//custom fields association
db.Categories.hasMany(db.CustomFields, { foreignKey: "category_id" });
db.CustomFields.belongsTo(db.Categories, { foreignKey: "category_id" });

db.SubCategories.hasMany(db.CustomFields, { foreignKey: "subcategory_id" });
db.CustomFields.belongsTo(db.SubCategories, { foreignKey: "subcategory_id" });

db.ProductColumns.hasMany(db.CustomFields, { foreignKey: "prd_col_id" });
db.CustomFields.belongsTo(db.ProductColumns, { foreignKey: "prd_col_id" });

//Model association
db.Brand.hasMany(db.Model, { foreignKey: "brand_id" });
db.Model.belongsTo(db.Brand, { foreignKey: "brand_id" });

db.Categories.hasMany(db.Model, { foreignKey: "category_id" });
db.Model.belongsTo(db.Categories, { foreignKey: "category_id" });

db.SubCategories.hasMany(db.Model, { foreignKey: "subcategory_id" });
db.Model.belongsTo(db.SubCategories, { foreignKey: "subcategory_id" });

//user association
db.Categories.hasMany(db.trn_user_req, { foreignKey: "category_id" });
db.trn_user_req.belongsTo(db.Categories, { foreignKey: "category_id" });

db.SubCategories.hasMany(db.trn_user_req, { foreignKey: "sub_cat_id" });
db.trn_user_req.belongsTo(db.SubCategories, { foreignKey: "sub_cat_id" });

db.Products.hasMany(db.trn_user_req, { foreignKey: "prd_id" });
db.trn_user_req.belongsTo(db.Products, { foreignKey: "prd_id" });

db.trn_wa_user.hasMany(db.trn_user_req, { foreignKey: "wa_user" });
db.trn_user_req.belongsTo(db.trn_wa_user, { foreignKey: "wa_user" });

db.Login.hasMany(db.trn_user_req, { foreignKey: "user" });
db.trn_user_req.belongsTo(db.Login, { foreignKey: "user" });

db.Model.hasMany(db.trn_user_req, { foreignKey: "model_id" });
db.trn_user_req.belongsTo(db.Model, { foreignKey: "model_id" });

// sold details association
db.Products.hasMany(db.SoldDetails, { foreignKey: "product_id" });
db.SoldDetails.belongsTo(db.Products, { foreignKey: "product_id" });

//user req images association
db.trn_user_req.hasMany(db.user_req_images, { foreignKey: "usr_req_id"});
db.user_req_images.belongsTo(db.trn_user_req, { foreignKey: "usr_req_id"});

//user req fields association
db.trn_user_req.hasMany(db.SellPrdFields, { foreignKey: "usr_req_id"});
db.SellPrdFields.belongsTo(db.trn_user_req, { foreignKey: "usr_req_id"});

db.SellPrdCol.hasMany(db.SellPrdFields, { foreignKey: "prd_col_id" });
db.SellPrdFields.belongsTo(db.SellPrdCol, { foreignKey: "prd_col_id" });

//user Favourites
db.Login.hasMany(db.UserFavourites, { foreignKey: "user_id" });
db.UserFavourites.belongsTo(db.Login, { foreignKey: "user_id" });

db.Products.hasMany(db.UserFavourites, { foreignKey: "product_id" });
db.UserFavourites.belongsTo(db.Products, { foreignKey: "product_id" });

// reserved details association
db.Products.hasMany(db.ReservedDetails, { foreignKey: "product_id" });
db.ReservedDetails.belongsTo(db.Products, { foreignKey: "product_id" });

// offer association
db.Products.hasMany(db.Offer, { foreignKey: "product_id" });
db.Offer.belongsTo(db.Products, { foreignKey: "product_id" });

//fcm token association
db.Login.hasOne(db.FcmToken, { foreignKey: "login_id" });
db.FcmToken.belongsTo(db.Login, { foreignKey: "login_id" });

// Product alert association
db.Categories.hasMany(db.ProductAlert, { foreignKey: "category_id" });
db.ProductAlert.belongsTo(db.Categories, { foreignKey: "category_id" });

db.SubCategories.hasMany(db.ProductAlert, { foreignKey: "subcategory_id" });
db.ProductAlert.belongsTo(db.SubCategories, { foreignKey: "subcategory_id" });

db.Brand.hasMany(db.ProductAlert, { foreignKey: "brand_id" });
db.ProductAlert.belongsTo(db.Brand, { foreignKey: "brand_id" });

db.Model.hasMany(db.ProductAlert, { foreignKey: "model_id" });
db.ProductAlert.belongsTo(db.Model, { foreignKey: "model_id" });

db.Login.hasMany(db.ProductAlert, { foreignKey: "login_id" });
db.ProductAlert.belongsTo(db.Login, { foreignKey: "login_id" });

module.exports = db;
