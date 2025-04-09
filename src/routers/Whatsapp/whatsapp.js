'use strict';
const { Server } = require("socket.io");
const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');
const express = require('express');
const http = require("http");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(cors());
const server = http.createServer(app);
const io = new Server(server);
const router = require('express').Router();
require('dotenv').config();
const cors = require('cors');
app.use(cors());
var https = require("follow-redirects").https;
const categoryService = require("../../services/mst_categories.service");
const subCategoryService = require("../../services/trn_subcategories.service");
const txtMsg = require("./textmessage");
const btnMsg = require("./button_message");


import("node-fetch")
    .then(({ default: fetch }) => {
        // Your code that uses fetch goes here
    })
    .catch((err) => {
        console.error("Error loading node-fetch:", err);
    });


const Whatsapp = new WhatsappCloudAPI({
    accessToken: process.env.Meta_WA_accessToken,
    senderPhoneNumberId: process.env.Meta_WA_SenderPhoneNumberId,
    WABA_ID: process.env.Meta_WA_wabaId,
});

var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

localStorage.clear();
router.get('/meta_wa_inforge', (req, res) => {
    try {
        console.log('GET: Connecting!');

        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        if (
            mode &&
            token &&
            mode === 'subscribe' &&
            process.env.Meta_WA_VerifyToken === token
        ) {
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    } catch (error) {
        console.error({ error });
        return res.sendStatus(500);
    }
});

router.post('/meta_wa_inforge', async (req, res) => {
    console.log('POST: Someone is pinging me!');
    let data = Whatsapp.parseMessage(req.body);
    if (!data.message) {
        return
    }
    let incomingMessage = data.message;
    let recipientPhone = incomingMessage.from.phone;

    let recipientName = incomingMessage.from.name;
    let typeOfMsg = incomingMessage.type; // extract the type of message (some are text, others are images, others are responses to buttons etc...)
    let message_id = incomingMessage.message_id; // extract the message id


    if (typeOfMsg === 'text_message') {
       await txtMsg.TextMessage(data,localStorage,Whatsapp);
    }
    else if (typeOfMsg === "radio_button_message" || typeOfMsg === "media_message") {
        await  btnMsg.ButtonMessage(data,localStorage,Whatsapp);
    }
    
    return res.sendStatus(200);
    });
module.exports = router;