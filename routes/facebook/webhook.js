const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Router = express.Router();
const request = require('request');
const apiaiApp = require('apiai')('67efa2ecd2514286b05cb58fdc3643fc');
const NodeGeocoder = require('node-geocoder');

const PAGE_ACCESS_TOKEN = 'EAAcaq8rzMQoBAMr1FgOiTW3Y4rn3fMZApefDoSSqrztUBFD74YaC8wLR50ELPGQwcFrX7qz6JEUbeLZBDaQlimlpYj5ujLZBvOZAW8v2qCvtVhnWaKrYdqgqrQkENlPzqETQZC9A2MdUZAH6UHK42vGq8mcEuV78kCLnc1ZA7xBzwZDZD';


const resTem = require('../templates/genRestaurantTemplate');
const foodTem = require('../templates/genFoodTemplate');
const genWhat = require('../templates/genWhatToDo');
const genLoc = require('../templates/genGetLocation');
const genCart = require('../templates/genCartTemplate');
const pipeline = require('./pipeline');

/* For Facebook Validation */
Router.get('/', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'quijinnbot') {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.status(403).end();
    }
});


let data = [];

/* Handling all messenges */
Router.post('/', (req, res) => {
    console.log(req.body);
    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                console.log('full event : ' + JSON.stringify(event, null, 2));
                if (event.postback) {
                    //sendPostback(event);
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
                        //sendMessage(event);
                        // genWhat.genFoodByCuisine('Fast food', function(err, result){
                        //     if(err) console.log(err);
                        //     else {
                        //         console.log(JSON.stringify(result, null,2));
                        //         sendRequest(event.sender.id, result);
                        //     }
                        // });
                        pipeline.data[event.sender.id] =
                            {
                                foods:
                                    [
                                        {
                                            food_id: 1,
                                            food_name: 'Burger',
                                            quantity: 2,
                                            price: 120,
                                            image_url: "https://media-cdn.tripadvisor.com/media/photo-s/0a/56/44/5a/restaurant.jpg"
                                        },
                                        {
                                            food_id: 2,
                                            food_name: 'Pizza',
                                            quantity: 1,
                                            price: 700,
                                            image_url: "https://media-cdn.tripadvisor.com/media/photo-s/0a/56/44/5a/restaurant.jpg"
                                        },
                                        {
                                            food_id: 3,
                                            food_name: 'Pasta',
                                            quantity: 4,
                                            price: 250,
                                            image_url: "https://media-cdn.tripadvisor.com/media/photo-s/0a/56/44/5a/restaurant.jpg"
                                        }
                                    ]
                            };
                        sendRequest(event.sender.id, genCart.genCart(pipeline.data[event.sender.id].foods));
                    }

                }

            });
        });
        res.status(200).end();
    }
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

            console.log(lat + ' ' + lng);

            geocoder.reverse({lat: lat, lon: lng},
                function (err, res) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(res);
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


module.exports = Router;