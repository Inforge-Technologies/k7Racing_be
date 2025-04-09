const categoryService = require("../../services/mst_categories.service");
const subCategoryService = require("../../services/trn_subcategories.service");
const constants = require("../../constants/whatsapp_text");
const trnUserReq = require("../../services/trn_wa_user.service");
const btnMessage = require("./button_message");
const db = require("../../config/dbconfig");
let colList;
async function TextMessage(data, localStorage, Whatsapp) {

    let incomingMessage = data.message;
    let recipientPhone = incomingMessage.from.phone;

    let recipientName = incomingMessage.from.name;
    let typeOfMsg = incomingMessage.type; // extract the type of message (some are text, others are images, others are responses to buttons etc...)
    let message_id = incomingMessage.message_id;
    if (incomingMessage.text.body.toLowerCase() === "h") {
        try {
            var res = await new Promise((resolve, reject) => {
                Whatsapp.sendImage({
                    url: "https://inforgetech.com/images/banner1-2.png",
                    recipientPhone: recipientPhone,
                    // mime_type :"image/jpeg"
                }).then(() => resolve()).catch(reject);

            });
            await new Promise(resolve => setTimeout(resolve, 1500));
            return res.statusCode;
        }
        catch (e) {
            console.log(e.message);
            return '403';
        }

    }
    if (incomingMessage.text.body.toLowerCase() === "hi") {
        localStorage.clear();
        checkuser(incomingMessage);
        // btnMessage.sendmesg = true;
        var buttonFilterType = [{
            title: "Buy",
            id: 'buysell_1',
            description: constants.buydesc
        },
        {
            title: "Sell",
            id: 'buysell_2',
            description: constants.selldesc
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
                bodyText: constants.bodyTxt,
                footerText: constants.footertext,
                listOfSections: sectionWithButtons,
                headerText: constants.headerTxt,
                actionTitle: constants.buysell
            });

        }
        catch (e) {
            console.log(e.message);
        }
    }
    else if (localStorage.getItem('sellQA') === "1") {
        colList = btnMessage.retCol();
        if (colList.length -1  === parseInt(localStorage.getItem('sellQANo'))) {
            localStorage.setItem('sellQA', "0");
            var ind1 = parseInt(localStorage.getItem('sellQANo')) ;
            var updateQa = colList[ind1];
             if (typeOfMsg === 'text_message') {
               
                               
                var sellPrd_cols ={
                    prd_col_id : updateQa.id,
                    usr_req_id : localStorage.getItem('trnUserdataID'),
                    field_value : incomingMessage.text.body
                }
               
                }
                else if (typeOfMsg === "radio_button_message" ) {
                 
                               
                                    var sellPrd_cols ={
                                        prd_col_id : updateQa.id,
                                        usr_req_id : localStorage.getItem('trnUserdataID'),
                                        field_value : incomingMessage.list_reply.id
                                    }
                                 
                }
                var r = await db.SellPrdFields.create(sellPrd_cols);
        }
        else {
            var ind = parseInt(localStorage.getItem('sellQANo')) + 1;
            localStorage.setItem('sellQANo', ind);
            if(ind >0){
                                 updateQa = colList[ind-1];
                               
                                    var sellPrd_cols ={
                                        prd_col_id : updateQa.id,
                                        usr_req_id : localStorage.getItem('trnUserdataID'),
                                        field_value : incomingMessage.text.body
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
                title: defVal[i],
                id: defVal[i],
                description: defVal[i]
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
function checkuser(incomingMessage) {
    let mobile_no = incomingMessage.from.phone;
    let user_wa_name = incomingMessage.from.name;
    var data = {
        user_wa_name: user_wa_name,
        mobile_no: mobile_no
    };
    trnUserReq.saveUserRequests(data);


}
module.exports = { TextMessage };