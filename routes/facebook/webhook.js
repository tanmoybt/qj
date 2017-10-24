const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
const apiaiApp = require('apiai')('67efa2ecd2514286b05cb58fdc3643fc');
const NodeGeocoder = require('node-geocoder');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const PAGE_ACCESS_TOKEN = 'EAAcaq8rzMQoBAMr1FgOiTW3Y4rn3fMZApefDoSSqrztUBFD74YaC8wLR50ELPGQwcFrX7qz6JEUbeLZBDaQlimlpYj5ujLZBvOZAW8v2qCvtVhnWaKrYdqgqrQkENlPzqETQZC9A2MdUZAH6UHK42vGq8mcEuV78kCLnc1ZA7xBzwZDZD';


const resTem =  require('./templates/genRestaurantTemplate');

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'quijinnbot') {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.status(403).end();
    }
});


let data = [];

/* Handling all messenges */
app.post('/webhook', (req, res) => {
    //console.log(req.body);
    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                console.log('full event : ' + JSON.stringify(event, null, 2));
                if (event.postback) {
                    sendPostback(event);
                }
                if (event.message) {
                    console.log('full event : ' + JSON.stringify(event, null, 2));
                    if (event.message.attachments) {
                        if (event.message.attachments[0].type === 'location') {

                            sendMessage(event);
                        }
                    }

                    if (event.message.text) {
                        //console.log('from fb : '+ JSON.stringify(event, null, 2));
                        sendMessage(event);
                    }

                }

            });
        });
        res.status(200).end();
    }
});

console.log(resTem.resTem());

app.post('/chatfuel', (req, res) => {
    console.log('here');
    console.log(req.body);
});

app.get('/chatfuel/:get', (req, res) => {
    console.log('here');
    console.log(req.body);
});



function sendMessage(event) {
    let sender = event.sender.id;

    if (event.message.text) {
        let text = event.message.text;


        let apiai = apiaiApp.textRequest(text, {
            sessionId: sender // use any arbitrary id
        });

        apiai.on('response', (response) => {
            let aiText = response.result.fulfillment.speech;
            let action = response.result.action;
            console.log('from api :');
            console.log(JSON.stringify(response, null, 2));
            console.log(data[sender]);

            data[sender] = {text: aiText};
            if (action == 'order_food.processType') {
                sendQuickReplyProcessType(sender);
                return;
            }
            else if (action == 'order_food.processType.getLocation') {
                getLocation(sender);
                return;
            }
            let messageData = {text: aiText};
            sendRequest(sender, messageData);
        });

        apiai.on('error', (error) => {
            console.log(error);
        });

        apiai.end();
    }
    else if (event.message.attachments) {

        if (event.message.attachments[0].type === 'location') {
            let options = {
                provider: 'google'
            };

            delete data[sender];
            const geocoder = NodeGeocoder(options);
            let lat = event.message.attachments[0].payload.coordinates.lat;
            let lng = event.message.attachments[0].payload.coordinates.long;

            geocoder.reverse({lat: lat, lon: lng},
                function (err, res) {
                    //console.log(res);
                    let messageData = {text: "looks like you're at " + res[0].formattedAddress};
                    sendRequest(sender, messageData);


                    let apiai = apiaiApp.textRequest(res[0].formattedAddress, {
                        sessionId: sender // use any arbitrary id
                    });

                    apiai.on('response', (response) => {
                        let aiText = response.result.fulfillment.speech;
                        let action = response.result.action;
                        console.log('from api :');
                        console.log(JSON.stringify(response, null, 2));
                        if (action == 'show_restaurants') {
                            let messageData = {text: aiText};
                            sendRequest(sender, messageData);

                            sendGeneric(sender);
                            return;
                        }
                    });

                    apiai.on('error', (error) => {
                        console.log(error);
                    });

                    apiai.end();
                });

        }
    }
}


function sendPostback(event) {
    let sender = event.sender.id;

    console.log(data[sender]);
    data[sender] = {text: event.postback.title};


}




function getLocation(sender) {
    let messageData = {
        "text": "Please share your location:",
        "quick_replies": [
            {
                "content_type": "location",
            },
            {
                "content_type": "text",
                "title": "Dhanmondi",
                "payload": "dhanmondi"
            },
            {
                "content_type": "text",
                "title": "Uttara",
                "payload": "uttara"
            }
        ]
    };
    sendRequest(sender, messageData);
}

function sendQuickReplyProcessType(sender) {
    let messageData = {
        "text": "How would like to order food",
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Location",
                "payload": "location"
            },
            {
                "content_type": "text",
                "title": "Restaurant",
                "payload": "restaurant"
            }
        ]
    };
    sendRequest(sender, messageData);
}

function sendRequest(sender, messageData) {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: PAGE_ACCESS_TOKEN},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function (err, response, body) {
        if (err) {
            console.log("sending error");
            console.log(err);
        } else if (response.body.error) {
            console.log("response body error");
            console.log(response.body.error);
        }
    })
}



const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});