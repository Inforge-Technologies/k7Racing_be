const loginService = require("../services/trn_login.service");

exports.saveNewUser = async (req, res) => {
    try {
        const userData = req.body;
        const result = await loginService.saveUser(userData);
        res.send(result);
    } catch (error) {
        res.status(500).send({ status: "Error", message: error.message });
    }
};

exports.userLogin = async (req, res) => {
    try {
        const userData = req.body;
        const user = await loginService.findUserPwd(userData);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkNewUser = (req, res) => {
    const phoneNo = req.body;
    loginService
      .sendOTPToNewUser(phoneNo)
      .then((otp) => {
        return res.send({
          status: "success",
          message: "OTP is sent to your device",
          otp: otp,
        });
      })
  
      .catch((err) => {
        res.status(500).send({ status: "error", message: err.message });
      });
  };