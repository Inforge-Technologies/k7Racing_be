const db = require("../config/dbconfig");
const passwordEncryption = require("../controllers/password_encrypt");
const jwt = require("jsonwebtoken");

// exports.saveUser = async (userData) => {
//   const existingUser = await db.Login.findOne({
//     where: {
//       mobile_no: userData.mobile_no,
//     },
//   });

//   if (!existingUser) {
//     let cryptedpassword = await passwordEncryption.cryptPassword(
//       userData.password
//     );
//     userData.password = cryptedpassword;
//     userData.role_id = 3;
//     await db.Login.create(userData);
//     return {
//       status: "Success",
//       message: `Registered successfully`,
//     };
//   } else {
//     throw new Error(`User already exists`);
//   }
// };

exports.saveUser = async (userData) => {
  const existingUser = await db.Login.findOne({
    where: {
      mobile_no: userData.mobile_no,
    },
  });

  if (existingUser) {
    throw new Error(`User already exists`);
  }

  const transaction = await db.sequelize.transaction(); // Start transaction

  try {
    let cryptedPassword = await passwordEncryption.cryptPassword(
      userData.password
    );
    userData.password = cryptedPassword;
    userData.role_id = 3;

    // Save user to Login table
    const newUser = await db.Login.create(userData, { transaction });

    // Check if mobile number exists in trn_wa_user
    const existingWaUser = await db.trn_wa_user.findOne({
      where: { mobile_no: `91${userData.mobile_no}` },
      transaction,
    });

    // Only create entry in trn_wa_user if mobile_no is not found
    if (!existingWaUser) {
      await db.trn_wa_user.create(
        {
          user_wa_name: userData.fullname,
          mobile_no: `91${userData.mobile_no}`
        },
        { transaction }
      );
    }

    // Commit transaction if everything succeeds
    await transaction.commit();

    return {
      status: "Success",
      message: `Registered successfully`,
    };
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    throw new Error(`Error while saving user: ${error.message}`);
  }
};

exports.findUserPwd = async (userData) => {
  try {
    const userLoginData = await db.Login.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        mobile_no: userData.phoneNo,
      },
      raw: true,
    });
    if (!userLoginData) {
      throw new Error("User Not found. Please register!");
    }

    let cryptedpassword = await passwordEncryption.comparePassword(
      userData.password,
      userLoginData.password
    );
    if (cryptedpassword) {
      const payload = {
        id: userLoginData.id,
        name: userLoginData.fullname,
        mobile_no: userLoginData.mobile_no,
        email: userLoginData.password,
        role: userLoginData.role_id
      };
      const privateKey = process.env.PRIVATE_KEY;
      const token = jwt.sign(payload, privateKey);
      return { token };
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.sendOTPToNewUser = async (loginData) => {
  let phoneNumber = loginData.mobileNo;

  if (!phoneNumber.startsWith("91")) {
    phoneNumber = "91" + phoneNumber;
  }

  const randomNo = Math.floor(1000 + Math.random() * 9000);
  const messageTemplate = `Your OTP Verification code is ${randomNo} Do not share it with anyone.Thalapathy Vijay Makkal Iyakkam-VMIOTP`;

  try {
    const { default: fetch } = await import("node-fetch");

    const response = await fetch(
      `http://site.ping4sms.com/api/smsapi?key=88e611e79a1274508006c35f8048e19a&route=2&sender=VMIOTP&number=Number(${ phoneNumber})&sms=${messageTemplate}&templateid=1007164811640781357`, {
           method: "POST"
       });

    const responseText = await response.text();
    console.log("SMS API response:", responseText);

    if (!response.ok) {
      throw new Error(`SMS API error: ${response.statusText}`);
    }

    return randomNo;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};


