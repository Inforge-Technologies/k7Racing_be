const whatsappUserService = require("../services/trn_wa_user.service");

exports.getMobileNoList = async (req, res) => {
    try {
        const mobileNoList = await whatsappUserService.getMobileNoList();
        res.send({ status: "Success", mobileNoList: mobileNoList });
    } catch (error) {
        console.error("Failed to fetch mobile number list:", error);
        res.status(500).send({ success: false, message: "Failed to fetch mobile number list" });
    }
};

exports.getUserByMobile = async (req, res) => {
    try {
        const { mobileNo } = req.params;
        const user = await whatsappUserService.findUserByMobile(mobileNo);

        if (user) {
            return res.status(200).json({
                status: "Success",
                userData: user,
            });
        } else {
            return res.status(404).json({
                status: "Error",
                message: "User not found",
            });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({
            status: "Error",
            message: "Internal server error",
        });
    }
};