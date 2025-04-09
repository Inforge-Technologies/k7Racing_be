const userReqService = require("../services/trn_user_req.service");
const wa_userService = require("../services/trn_wa_user.service");
const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');

exports.saveProduct = async (req, res) => {
    try {
        const userReqData = JSON.parse(req.body.productData);


        const result = await userReqService.saveUserReq(userReqData);

        // if (id != null) {
        //     return res.status(200).json({
        //         status: "Success",
        //         message: `Product updated successfully`,
        //         data: result,
        //     });
        // } else {
        //     return res.status(200).json({
        //         status: "Success",
        //         message: `Product created successfully`,
        //         data: result,
        //     });
        // }
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};

exports.saveReqProduct = async (req, res) => {
    try {
        const productData = JSON.parse(req.body.productData);
        const fieldData = JSON.parse(req.body.fieldData);
        // const id = req.body.id;

        const result = await userReqService.saveReqProduct(productData, fieldData, req.files);

        return res.status(200).json({
            status: "Success",
            message: `Product created successfully`,
            data: result,
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};

exports.getAllUserRequests = async (req, res) => {
    try {
        const userRequestList = await userReqService.getAllUserRequests();
        res.send({ status: "Success", userRequestList: userRequestList });
    } catch (error) {
        console.error("Failed to fetch user request list:", error);
        res.status(500).send({ success: false, message: "Failed to fetch user request list" });
    }
};

exports.getallUserReq = async (req, res) => {
    try {
        // const userReqData = JSON.parse(req.body.productData);
       

        const result = await userReqService.findAllUserReqByDate();
        const Whatsapp = new WhatsappCloudAPI({
            accessToken: process.env.Meta_WA_accessToken,
            senderPhoneNumberId: process.env.Meta_WA_SenderPhoneNumberId,
            WABA_ID: process.env.Meta_WA_wabaId,
        });
        
        result.forEach(element => {
            // Whatsapp.sendText({
            //     recipientPhone: element.trn_wa_user.mobile_no,
            //     message: 'Hi ' + element.trn_wa_user.user_wa_name +" Welcome to INforge"
            // });
        });

        res.send(result);
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};

exports.findRequestProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const reqProduct = await userReqService.findRequestProductById(id);
        if (reqProduct) {
            return res.send({ status: "Success", RequestProductData: reqProduct });
        } else {
            return res
                .status(404)
                .send({ status: "Error", message: "User request product data not found" });
        }
    } catch (error) {
        res
            .status(500)
            .send({ status: "Error", message: "Failed to find user request product data by ID" });
    }
};

exports.getUserReqSellList = async (req, res) => {
    try {
        const user = req.body.user;
        const userRequestSellList = await userReqService.getUserReqSellList(user);
        res.send({ status: "Success", userRequestSellList: userRequestSellList });
    } catch (error) {
        console.error("Failed to fetch user request sell list:", error);
        res.status(500).send({ success: false, message: "Failed to fetch user request sell list" });
    }
};

exports.deleteUserRequest = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await userReqService.deleteUserRequest(id);
        res.send(result);
    } catch (error) {
        console.error("Failed to delete user request:", error);
        res.status(500).send({ status: "Error", message: "Failed to delete user request" });
    }
};