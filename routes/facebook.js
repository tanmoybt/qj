const express= require('express');
const router = express.Router();
const request = require('request');

const accessToken = 'EAAbWF2z6CeoBAMheb2GH6CZA43A2q0JYCCvHxqxQ5QdSZBHZB7Vfc5IVy5xSMeOjvtbdjOV7yVS3nvKDDTYFsQyEWpdjz67coLMzWqu8UaBmRZBt25MuhX8tTpNLNqAfqhiC8cHr1fIL4TmuPv9ZCE93NJ7FvdeXY5OKXxnvgFAZDZD';

router.get('/', function(req, res){
    console.log("challenge has been taken.....................\n");

    if(req.query['hub.verify_token'] === 'nodebot'){
        console.log("challenge has been validated.....................\n");
        res.send(req.query['hub.challenge'])
    }
    //res.send("wrong token");
});

router.post('/', function(req, res){
    let msg_events= req.body.entry[0].messaging;
    for(let i=0; i<msg_events.length; i++){
        let event= msg_events[i];
        let sender= event.sender.id;
        if(event.message){
            //console.log(event.message);
            if(event.message.attachments) {
                let lat = event.message.attachments[0].payload.coordinates.lat;
                let lng = event.message.attachments[0].payload.coordinates.long;
                if (lat && lng) {
                    sendText(sender, lat);
                    sendText(sender, lng);
                }
            }
        }
        if(event.message && event.message.text){
            let text= event.message.text;
            //console.log(event.message);
            if(event.message.attachments) {
                let lat = event.message.attachments[0].payload.coordinates.lat;
                let lng = event.message.attachments[0].payload.coordinates.long;
                if (lat && lng) {
                    sendText(sender, lat);
                    sendText(sender, lng);
                }
            }
            if(text.includes('Order Food')){
                sendList(sender);
            }
            else if(text.includes('location')){
                sendLocation(sender);
            }
            else{
                sendText(sender, "your reply "+ text);
                decideMessage(sender, text);
            }
        }
        if(event.postback) {
            //console.log(event.postback);
            let text = JSON.stringify(event.postback);
            let lat = event.message.attachments[0].payload.coordinates.lat;
            let lng = event.message.attachments[0].payload.coordinates.long;
            if(lat && lng){
                sendText(sender, lat);
                sendText(sender, lng);
            }
            if(text=='Order Food'){
                sendList(sender);
            }
            else if(text.includes('location')){
                sendLocation(sender);
            }
            else{
                sendText(sender, "your reply "+ text);
                decideMessage(sender, text);
            }
        }
    }
    res.sendStatus(200);
});

function decideMessage(sender, text1){
    let text= text1.toLowerCase();
    if(text.includes("summer")){
        sendImage(sender);
    } else if (text.includes("winter")){
        sendList(sender);
    } else {
        sendText('I like fall');
        sendQuickReply(sender);
    }
}

function sendImage(sender){
    let messageData= {
        "attachment":{
            "type":"image",
            "payload":{
                "url": "https://salty-beyond-39933.herokuapp.com/img.jpg",
            }
        }
    };
    sendRequest(sender, messageData);
}

function sendGeneric(sender){
    let messageData= {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"generic",
                "elements":[
                    {
                        "title":"winter is great",
                        "image_url": "https://salty-beyond-39933.herokuapp.com/img.jpg",
                        "subtitle":"great chills",
                        "buttons":[
                            {
                                "type":"postback",
                                "title":"Start Chatting",
                                "payload":"summer"
                            }
                        ]
                    }
                ]
            }
        }
    };
    sendRequest(sender, messageData);
}

function sendList(sender){
    //let messageData= resData.listTem;
    //sendRequest(sender, messageData);
}

function sendQuickReply(sender){
    let messageData = {
        "text":"fav season?",
        "quick_replies":[
            {
                "content_type":"text",
                "title":"Summer",
                "payload":"summer"
            },
            {
                "content_type":"text",
                "title":"Winter",
                "payload":"winter"
            }
        ]
    };
    sendRequest(sender, messageData);
}

function sendLocation(sender){
    let messageData= {
        "text":"Please share your location:",
        "quick_replies":[
            {
                "content_type":"location",
            },
            {
                "content_type":"text",
                "title":"Dhanmondi",
                "payload":"dhanmondi"
            },
            {
                "content_type":"text",
                "title":"Uttara",
                "payload":"uttara"
            }
        ]
    };
    sendRequest(sender, messageData);
}

function sendRequest(sender, messageData){
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: accessToken},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function(err, response, body){
        if(err){
            console.log("sending error");
            console.log(err);
        } else if (response.body.error){
            console.log("response body error");
            console.log(response.body.error);
        }
    })
}

function sendText(sender, text){
    let messageData = {text: text};
    sendRequest(sender, messageData);
}


module.exports = router;
