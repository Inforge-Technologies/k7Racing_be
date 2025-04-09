const db = require("../config/dbconfig");
const fs = require("fs");
const path = require("path");
const Op = db.Sequelize.Op;

exports.getMobileNoList = async () => {
  try {
    const waUserMobileNos = await db.trn_wa_user.findAll({
      attributes: ["id", "mobile_no"],
    });

    // 🔧 Remove '91' prefix from mobile_no
    const cleanedMobileNos = waUserMobileNos.map((user) => ({
      id: user.id,
      mobile_no: user.mobile_no.startsWith("91") ? user.mobile_no.substring(2) : user.mobile_no,
    }));

    return cleanedMobileNos;
  } catch (error) {
    throw new Error("Failed to fetch mobile number list: " + error.message);
  }
};


exports.findUserByMobile = async (mobileNo) => {
  try {
    // Ensure the mobile number starts with '91'
    const formattedMobileNo = `91${mobileNo}`;

    // Find user with the formatted number
    const user = await db.trn_wa_user.findOne({
      where: { mobile_no: formattedMobileNo },
      attributes: ["user_wa_name", "mobile_no"],
    });

    return user;
  } catch (error) {
    console.error("Error in user service:", error);
    throw new Error("Failed to fetch user data");
  }
};

// Helper function to trim first 2 digits if mobile number is 12 digits long
const processMobileNo = (mobileNo) => {
  return mobileNo.length === 12 ? mobileNo.slice(2) : mobileNo;
};

exports.saveUserRequests = async (
  userReqData,
) => {
  try {
    const existingUserReq = await db.trn_wa_user.findOne({
      where: {
        mobile_no: userReqData.mobile_no,
      },
    });



    if (!existingUserReq) {
      await db.trn_wa_user.create(userReqData);
      return {
        status: "Success",
        message: `User is saved successfully`,
      };
    } else {
      return { status: "Error", message: `user Already Exist` };
    }
  } catch (error) {
    throw new Error("Failed to save user Request: " + error.message);
  }
};

exports.updateUserType = async (data) => {
  try {
    const result = await db.trn_wa_user.update(
      { buysell: data.buysell },
      { where: { id: id } }
    );
    if (result[0] === 0) {
      throw new Error("Product not found or not deleted");
    }
    return {
      status: "Success",
      message: "Product deleted successfully"
    };
  } catch (error) {
    throw new Error("Failed to delete product: " + error.message);
  }
};

exports.findUserBymob = async (data) => {
  try {
    const product = await db.trn_wa_user.findOne({
      where: {
        mobile_no: data.mob,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"], // "createdAt", "updatedAt"
      },
    });
    return product;
  } catch (error) {
    throw new Error("Failed to find Product by ID: " + error.message);
  }
};

exports.findAllUserReq = async () => {
  try {
    var today = new Date();
    // var minDate = today.addDays(-10);
    var someDate = new Date();
    var numberOfDaysToAdd = -10;
    var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    const product = await db.trn_wa_user.findAll({
      where: {
        createdAt: {
          [Op.between]: [result, today]
        }
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"], // "createdAt", "updatedAt"
      },
    });
    return product;
  } catch (error) {
    throw new Error("Failed to find Product by ID: " + error.message);
  }
};