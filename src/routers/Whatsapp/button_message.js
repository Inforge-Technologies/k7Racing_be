const axios = require("axios");
const categoryService = require("../../services/mst_categories.service");
const subCategoryService = require("../../services/trn_subcategories.service");
const constants = require("../../constants/whatsapp_text");
const prdService = require("../../services/trn_product.service");
const sellPrd = require("./sell_product");
const mstbrandService = require("../../services/mst_brand.service");
const mstModelService = require("../../services/mst_model.service");
const sellPrdColService = require("../../services/mst_sell_product_columns.service");
const trnWAUser = require("../../services/trn_wa_user.service");
const trnUserReq = require("../../services/trn_user_req.service");
const db = require("../../config/dbconfig");
const fs = require("fs");
const path = require("path");
const sharp = require('sharp');
const mime = require('mime-types');
let colList;
var sendmesg = true;
async function ButtonMessage(data, localStorage, Whatsapp) {
    let incomingMessage = data.message;
    let recipientPhone = incomingMessage.from.phone;

    let recipientName = incomingMessage.from.name;
    let typeOfMsg = incomingMessage.type; // extract the type of message (some are text, others are images, others are responses to buttons etc...)
    let message_id = incomingMessage.message_id;
    if (typeOfMsg === "radio_button_message") {
        if (incomingMessage.list_reply.id.includes("buysell")) {
            // checkuser(incomingMessage);
            if (incomingMessage.list_reply.id === "buysell_1") {
                const getAllCategories = await categoryService.getAllCategories(data);
                var buttonObj = [];
                if (getAllCategories.length > 0) {
                    var i = 0;
                    getAllCategories.forEach((element) => {
                        var data = {
                            title: element.category_name,
                            id: "category_" + element.id,
                            description: element.category_description
                        }
                        buttonObj.push(data);
                        i++;
                    });

                }
                const sectionWithButtons = [
                    {
                        title: "Please select Category",
                        rows: buttonObj,
                    },
                ];
                try {



                    var res = await Whatsapp.sendRadioButtons({
                        recipientPhone: recipientPhone,
                        bodyText: constants.bodyTxt,
                        footerText: constants.footertext,
                        listOfSections: sectionWithButtons,
                        headerText: constants.headerTxt,
                        actionTitle: constants.category
                    });

                    localStorage.setItem('buyorsell', 1);
                    console.log(res);
                    var wa_user = await trnWAUser.findUserBymob(data);
                    var buysell_id = incomingMessage.list_reply.id.split("_")[1];
                    var wa_userId = wa_user.id;
                    var dat = {
                        
                        buysell: buysell_id,
                        wa_user: wa_userId
                    }

                    // var res = await trnUserReq.saveUserReq(dat);
                    var r = await db.trn_user_req.create(dat);
                    localStorage.setItem('trnUserdataID', r.id);

                }
                catch (e) {
                    console.log(e.message);
                }

            }
            if (incomingMessage.list_reply.id === "buysell_2") {

                const getAllCategories = await categoryService.getAllCategories(data);
                var buttonObj = [];
                if (getAllCategories.length > 0) {
                    var i = 0;
                    getAllCategories.forEach((element) => {
                        var data = {
                            title: element.category_name,
                            id: "sellCategory_" + element.id,
                            description: element.category_description
                        }
                        buttonObj.push(data);
                        i++;
                    });

                }
                const sectionWithButtons = [
                    {
                        title: "Please select Category",
                        rows: buttonObj,
                    },
                ];
                try {



                    var res = await Whatsapp.sendRadioButtons({
                        recipientPhone: recipientPhone,
                        bodyText: constants.bodyTxt,
                        footerText: constants.footertext,
                        listOfSections: sectionWithButtons,
                        headerText: constants.headerTxt,
                        actionTitle: constants.category
                    });


                }
                catch (e) {
                    console.log(e.message);
                }
            }

            var buysell_id = incomingMessage.list_reply.id.split("_")[1];
            var data = {
                mob: recipientPhone
            }
            var wa_user = await trnWAUser.findUserBymob(data);
            var wa_userId = wa_user.id;
            var dat = {
                buysell: buysell_id,
                wa_user: wa_userId
            }

            // var res = await trnUserReq.saveUserReq(dat);
            var r = await db.trn_user_req.create(dat);


            localStorage.setItem('trnUserdataID', r.id);



        }
        else if (incomingMessage.list_reply.id.includes("category_")) {
            localStorage.setItem('category', incomingMessage.list_reply.id.split("_")[1]);
            var buttonFilterType = [{
                title: "By Budget",
                id: 'filter_1',
                description: constants.budgetTxt
            },
            {
                title: "By Variant",
                id: 'filter_2',
                description: constants.variantTxt
            },
            ];
           var category_id = incomingMessage.list_reply.id.split("_")[1]
            await db.trn_user_req.update(
                { category_id: category_id },
                {
                    where: {
                        id: localStorage.getItem('trnUserdataID'),
                    },
                },
            );
            const sectionWithButtons = [
                {
                    title: "departmentSelection",
                    rows: buttonFilterType,
                },
            ];
            try {

                await Whatsapp.sendRadioButtons({
                    recipientPhone: recipientPhone,
                    headerText: constants.filterTxt,
                    bodyText: constants.filterBodyTxt,
                    footerText: constants.footertext,
                    listOfSections: sectionWithButtons,
                    actionTitle: constants.filter
                });

            }
            catch (e) {
                console.log(e.message);
            }
        }

        //Step 3
        else if (incomingMessage.list_reply.id.includes("filter")) {

            if (incomingMessage.list_reply.id === "filter_1") {

                var buttonFilterType = [{
                    title: "0 to 25,000",
                    id: 'budget_1',
                    description: constants.budget1Desc
                },
                {
                    title: "25,000 to 50,000",
                    id: 'budget_2',
                    description: constants.budget2Desc
                },
                {
                    title: "Above 50,000",
                    id: 'budget_3',
                    description: constants.budget3Desc
                }];

                const sectionWithButtons = [
                    {
                        title: "departmentSelection",
                        rows: buttonFilterType,
                    },
                ];



                try {
                    await Whatsapp.sendRadioButtons({
                        recipientPhone: recipientPhone,
                        headerText: constants.variant,
                        bodyText: constants.variantBody,
                        footerText: constants.footertext,
                        listOfSections: sectionWithButtons,
                        actionTitle: constants.budget
                    });

                }
                catch (e) {
                    console.log(e.message);
                }
            } else if (incomingMessage.list_reply.id === "filter_2") {

                var category = { categoryId: localStorage.getItem('category') };
                const subCategoriesList = await subCategoryService.getAllSubCategories(category);
                var buttonObj = [];
                if (subCategoriesList.length > 0) {
                    var i = 0;
                    subCategoriesList.forEach((element) => {
                        var data = {
                            title: element.subcategory_name,
                            id: "variant_" + element.id,
                            description: element.subcategory_description
                        }
                        buttonObj.push(data);
                        i++;
                    });
                }
                try {

                    const sectionWithButtons = [
                        {
                            title: "departmentSelection",
                            rows: buttonObj,
                        },
                    ];


                    await Whatsapp.sendRadioButtons({
                        recipientPhone: recipientPhone,
                        headerText: constants.variant,
                        bodyText: constants.variantBody,
                        footerText: constants.footertext,
                        listOfSections: sectionWithButtons,
                        actionTitle: constants.variant
                    });

                }
                catch (e) {
                    console.log(e.message);
                }
            }
        }

        //Step 3
        else if (incomingMessage.list_reply.id.includes("budget_")) {
            localStorage.setItem('range', incomingMessage.list_reply.id.split("_")[1]);
            var range;
            if (incomingMessage.list_reply.id === "budget_1") {
                range = { min: 0, max: 24999 };
            }
            else if (incomingMessage.list_reply.id === "budget_2") {
                range = { min: 25000, max: 49999 };
            }
            else if (incomingMessage.list_reply.id === "budget_3") {
                range = { min: 50000, max: 24999999 };
            }

            await db.trn_user_req.update(
                { budget: incomingMessage.list_reply.id.split("_")[1] },
                {
                    where: {
                        id: localStorage.getItem('trnUserdataID'),
                    },
                },
            );
            const prdList = await prdService.getAllProductByBudget(range);
            var buttonObj = [];;
            var textMsg = '';
            if (prdList.length > 0) {
                var i = 1;

                prdList.forEach((element) => {
                    var data = {
                        title: element.prd_title.substring(0,70),
                        id: "chossePrd_" + element.id,
                        description:  "Selling Price :*" + element.selling_price + "* "
                    }
                    buttonObj.push(data);
                    i++;
                    
                });
                const sectionWithButtons = [
                    {
                        title: "departmentSelection",
                        rows: buttonObj,
                    },
                ];
                await Whatsapp.sendRadioButtons({
                    recipientPhone: recipientPhone,
                    headerText: constants.mobileHeader,
                    bodyText: constants.mobileBody,
                    footerText: constants.footertext,
                    listOfSections: sectionWithButtons,
                    actionTitle: constants.chossePrd
                });
            }
            else {
                Whatsapp.sendText({
                    recipientPhone: recipientPhone,
                    message: constants.noStock
                });
            }

        }
        else if (incomingMessage.list_reply.id.includes("variant")) {

            localStorage.setItem('subcategory', incomingMessage.list_reply.id.split("_")[1]);
            var range;

            range = {
                category_id: localStorage.getItem('subcategory'),
                subcategory_id: incomingMessage.list_reply.id.split("_")[1]
            };
            const prdList = await prdService.getAllProductByCatAndSub(range);
            var buttonObj = [];
            var textMsg = '';
            await db.trn_user_req.update(
                { sub_cat_id: incomingMessage.list_reply.id.split("_")[1] },
                {
                    where: {
                        id: localStorage.getItem('trnUserdataID'),
                    },
                },
            );
            if (prdList.length > 0) {
                var i = 1;

                prdList.forEach((element) => {
                    var data = {
                        title: element.prd_title.substring(0,70),
                        id: "chossePrd_" + element.id,
                        description: "Selling Price :*" + element.selling_price + "* "
                    }
                    buttonObj.push(data);
                    i++;
                   
                });
                const sectionWithButtons = [
                    {
                        title: "departmentSelection",
                        rows: buttonObj,
                    },
                ];
                await Whatsapp.sendRadioButtons({
                    recipientPhone: recipientPhone,
                    headerText: constants.mobileHeader,
                    bodyText: constants.mobileBody,
                    footerText: constants.footertext,
                    listOfSections: sectionWithButtons,
                    actionTitle: constants.chossePrd
                });
                // Whatsapp.sendText({
                //     recipientPhone: recipientPhone,
                //     message: textMsg
                // });
            }
            else {
                Whatsapp.sendText({
                    recipientPhone: recipientPhone,
                    message: constants.noStock
                });


            }
        }
        else if (incomingMessage.list_reply.id.includes("chossePrd_")) {
            var prd = incomingMessage.list_reply.id.split("_")[1];

            var prd_id = { id: prd };
            const prdList = await prdService.getSinglePrdInfo(prd_id);
            const prdimages = await prdService.getSinglePrdImages(prd_id);
            var buttonObj = [];
            var textMsg = '';
            await db.trn_user_req.update(
                { prd_id: incomingMessage.list_reply.id.split("_")[1] },
                {
                    where: {
                        id: localStorage.getItem('trnUserdataID'),
                    },
                },
            );
            var data = "*" + prdList.prd_title.trim() + "*\n " +
                "`" + prdList.prd_description + "`\n" + "- *Selling Price :* _" + prdList.selling_price + "_ \n"
            var flds = ""
            prdList.mst_product_fields.forEach(element => {
                flds += "- *" + element.mst_product_column.field + ":* _```" + element.field_value + "```_ \n"
            });
            data = data + flds
            Whatsapp.sendText({
                recipientPhone: recipientPhone,
                message: data
            });

            if (prdimages.length > 0) {
                for (var i = 0; i < prdimages.length; i++) {
                    await new Promise((resolve, reject) => {
                        Whatsapp.sendImage({
                            url: prdimages[i].image_url,
                            recipientPhone: recipientPhone
                        }).then(() => resolve()).catch(reject);

                    });
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            }
            await Whatsapp.sendText({
                recipientPhone: recipientPhone,
                message: constants.BuyThankMessage
            });
            await Whatsapp.sendLocation({
                recipientPhone: recipientPhone,
                latitude: constants.latitude,
                longitude: constants.longitude,
                name: constants.Shopname,
                address: constants.address

            });
        }

        else if (incomingMessage.list_reply.id.includes("sellCategory")) {
            var catId = incomingMessage.list_reply.id.split("_")[1];
            localStorage.setItem('sellCategory', incomingMessage.list_reply.id.split("_")[1]);
            var category = { categoryId: catId };

            await db.trn_user_req.update(
                { category_id: catId },
                {
                    where: {
                        id: localStorage.getItem('trnUserdataID'),
                    },
                },
            );
            const subCategoriesList = await subCategoryService.getAllSubCategories(category);
            var buttonObj = [];
            if (subCategoriesList.length > 0) {
                var i = 0;
                subCategoriesList.forEach((element) => {
                    var data = {
                        title: element.subcategory_name,
                        id: "sellVariant_" + element.id,
                        description: element.subcategory_description
                    }
                    buttonObj.push(data);
                    i++;
                });
            }
            try {

                const sectionWithButtons = [
                    {
                        title: "departmentSelection",
                        rows: buttonObj,
                    },
                ];


                await Whatsapp.sendRadioButtons({
                    recipientPhone: recipientPhone,
                    headerText: constants.variant,
                    bodyText: constants.variantBody,
                    footerText: constants.footertext,
                    listOfSections: sectionWithButtons,
                    actionTitle: constants.variant
                });

            }
            catch (e) {
                console.log(e.message);
            }

        }
        else if (incomingMessage.list_reply.id.includes("sellVariant_")) {

            var catId = localStorage.getItem('sellCategory');

            localStorage.setItem('sellsubCategory', incomingMessage.list_reply.id.split("_")[1]);
            var subCat = incomingMessage.list_reply.id.split("_")[1];

            var category = {
                category_id: catId,
                subcategory_id: subCat
            };

            await db.trn_user_req.update(
                { sub_cat_id: subCat },
                {
                    where: {
                        id: localStorage.getItem('trnUserdataID'),
                    },
                },
            );

            const modelList = await mstModelService.getModelListByCatAndSub(category);
            var buttonObj = [];
            if (modelList.length > 0) {
                var i = 0;
                modelList.forEach((element) => {
                    var data = {
                        title: element.model_name,
                        id: "sellModel_" + element.id,
                        description: element.model_name
                    }
                    buttonObj.push(data);
                    i++;
                });
            }
            try {

                const sectionWithButtons = [
                    {
                        title: "departmentSelection",
                        rows: buttonObj,
                    },
                ];


                await Whatsapp.sendRadioButtons({
                    recipientPhone: recipientPhone,
                    headerText: constants.model,
                    bodyText: constants.modelBody,
                    footerText: constants.footertext,
                    listOfSections: sectionWithButtons,
                    actionTitle: constants.model
                });

            }
            catch (e) {
                console.log(e.message);
            }
        }
        else if (incomingMessage.list_reply.id.includes("sellModel_")) {
            var modelId = incomingMessage.list_reply.id.split("_")[1];
            await db.trn_user_req.update(
                { model_id: modelId },
                {
                    where: {
                        id: localStorage.getItem('trnUserdataID'),
                    },
                },
            );
            colList = await sellPrdColService.getColumnList(category);
            localStorage.setItem('sellQA', "1");
            localStorage.setItem('colList', colList);
            localStorage.setItem('sellQANo', -1);
            var qa = colList[0];

        }
        if (localStorage.getItem('sellQA') === "1") {
            if (colList.length - 1 === parseInt(localStorage.getItem('sellQANo'))) {
                localStorage.setItem('sellQA', "0");
                var ind1 = parseInt(localStorage.getItem('sellQANo'));
                var updateQa = colList[ind1];
                if (typeOfMsg === 'text_message') {


                    var sellPrd_cols = {
                        prd_col_id: updateQa.id,
                        usr_req_id: localStorage.getItem('trnUserdataID'),
                        field_value: incomingMessage.text.body
                    }

                }
                else if (typeOfMsg === "radio_button_message") {


                    var sellPrd_cols = {
                        prd_col_id: updateQa.id,
                        usr_req_id: localStorage.getItem('trnUserdataID'),
                        field_value: incomingMessage.list_reply.id
                    }

                }
                var r = await db.SellPrdFields.create(sellPrd_cols);

                let recipientPhone = incomingMessage.from.phone;


                Whatsapp.sendText({
                    recipientPhone: recipientPhone,
                    message: constants.sendimages
                });

            }
            else {
                var ind = parseInt(localStorage.getItem('sellQANo')) + 1;
                localStorage.setItem('sellQANo', ind);
                var updateQa
                if (ind > 0) {
                    updateQa = colList[ind - 1];

                    var sellPrd_cols = {
                        prd_col_id: updateQa.id,
                        usr_req_id: localStorage.getItem('trnUserdataID'),
                        field_value: incomingMessage.list_reply.id
                    }
                    var r = await db.SellPrdFields.create(sellPrd_cols);
                }


                var qa = colList[localStorage.getItem('sellQANo')];
                if (qa.type === 1 || qa.type === 3) {

                    sendTxtmessage(qa, Whatsapp, incomingMessage);
                }
                else if (qa.type === 2) {

                    sendListmessage(qa, Whatsapp, incomingMessage);
                }

            }
        }
    }
    else if (localStorage.getItem('trnUserdataID') != 'undefined' && localStorage.getItem('trnUserdataID') != null) {
        const imgPath = `${process.env.protocol}${process.env.domain}`;
        const filename = incomingMessage.from.phone + "_" + Date.now() + ".jpg";
        const uploadDir = path.join(__dirname, "..", "..", "..", "resources", "assets", "userProducts", filename);
        const dbSavePath = `${imgPath}/resources/assets/userProducts/${filename}`;
        // const imagePath = path.join(__dirname, '..', '..', 'upload_assets', 'id_proof', "userProducts", `${filename}.${extension}`);
        // const dbSavePath = `${imgPath}/resources/assets/userProducts/${filename}.${extension}`;

        // Prepare the full path where the image will be saved

        try {
            var mediaId = incomingMessage.image.id;
            const baseUrl = 'https://graph.facebook.com/v13.0/';
            const url = `${baseUrl}${mediaId}/`;
            console.log('Fetching image URL:', url); // Log the URL for debugging

            // Include access token in request headers
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${process.env.Meta_WA_accessToken}`
                }
            });

            const imageUrl = response.data.url;

            // Download the image using the obtained URL
            const imageResponse = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': `Bearer ${process.env.Meta_WA_accessToken}`
                }
            });

            await fs.writeFileSync(uploadDir, imageResponse.data);

            console.log('Image downloaded successfully at:', uploadDir);

            var userReqid = localStorage.getItem('trnUserdataID');
            var userReqImg = {
                usr_req_id: userReqid,
                img_path: dbSavePath
            }
            await db.user_req_images.create(userReqImg);

            let recipientPhone = incomingMessage.from.phone;



        }
        catch (error) {
            console.error('Error downloading image:', error);
            throw error;
        }

        if (sendmesg) {
            sendmesg = false;
            await Whatsapp.sendText({
                recipientPhone: recipientPhone,
                message: constants.ThankMessage
            });
            await Whatsapp.sendLocation({
                recipientPhone: recipientPhone,
                latitude: constants.latitude,
                longitude: constants.longitude,
                name: constants.Shopname,
                address: constants.address

            });


        }


    }
}



function sendTxtmessage(qa, Whatsapp, incomingMessage) {

    let recipientPhone = incomingMessage.from.phone;


    Whatsapp.sendText({
        recipientPhone: recipientPhone,
        message: qa.field
    });

}

async function sendListmessage(qa, Whatsapp, incomingMessage) {

    let recipientPhone = incomingMessage.from.phone;
    var defVal = qa.default_value.split(",");
    var buttonObj = [];
    if (defVal.length > 0) {
        var i = 0;
        for (var i = 0; i < defVal.length; i++) {
            var data = {
                title: defVal[i].trim(),
                id: defVal[i].trim(),
                description: defVal[i].trim()
            }
            buttonObj.push(data);
        }
    }
    try {

        const sectionWithButtons = [
            {
                title: "departmentSelection",
                rows: buttonObj,
            },
        ];


        await Whatsapp.sendRadioButtons({
            recipientPhone: recipientPhone,
            headerText: "Select " + qa.field,
            bodyText: "Please Select " + qa.field,
            footerText: constants.footertext,
            listOfSections: sectionWithButtons,
            actionTitle: qa.field + "?",
        });

    }
    catch (e) {
        console.log(e.message);
    }


}
function retCol() {
    return colList
}
module.exports = { ButtonMessage, retCol };