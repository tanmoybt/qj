const NodeGeocoder = require('node-geocoder');
const resTem = require('../templates/genRestaurantTemplate');
const foodTem = require('../templates/genFoodTemplate');
const genWhat = require('../templates/genWhatToDo');
const genLoc = require('../templates/genGetLocation');
const genCart = require('../templates/genCartTemplate');
const pipeline = require('./pipeline');
const postback = require('./postbacks');
const request = require('request');
const apiai = require('./apiai');
const actions= require('./actions');


const PAGE_ACCESS_TOKEN = 'EAAcaq8rzMQoBAMr1FgOiTW3Y4rn3fMZApefDoSSqrztUBFD74YaC8wLR50ELPGQwcFrX7qz6JEUbeLZBDaQlimlpYj5ujLZBvOZAW8v2qCvtVhnWaKrYdqgqrQkENlPzqETQZC9A2MdUZAH6UHK42vGq8mcEuV78kCLnc1ZA7xBzwZDZD';


module.exports.messagesProcessor = function (sender, message) {
    if (message.attachments && message.attachments[0].type === 'location') {
        let options = {
            provider: 'google',
            apiKey: 'AIzaSyBeMeLnG6dPdAmOnhNeIyBZhYgsY9HGGbw'
        };
        const geocoder = NodeGeocoder(options);
        let lat = message.attachments[0].payload.coordinates.lat;
        let lng = message.attachments[0].payload.coordinates.long;

        if (!pipeline.data[sender].location.address && pipeline.data[sender].foods.length===0) {

            console.log(lat + ' ' + lng);

            geocoder.reverse({lat: lat, lon: lng},
                function (err, res) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(res);
                    console.log(res[0].formattedAddress);
                    console.log(res[0].zipcode);
                    locationProcessor(sender, res[0].formattedAddress, res[0].zipcode, res[0].extra.neighborhood);
                });
        }
        else if(!pipeline.data[sender].location.address && pipeline.data[sender].foods.length>0){
            console.log(lat + ' ' + lng);

            geocoder.reverse({lat: lat, lon: lng},
                function (err, res) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(res);
                    console.log(res[0].formattedAddress);
                    console.log(res[0].zipcode);
                    pipeline.data[sender].location.address = res[0].formattedAddress;
                    let messageData= {text: 'The location is traced from get location ' + res[0].formattedAddress + ', full confirmation, no action'};
                    apiai.apiaiProcessor(sender, messageData.text);
                    messageData= {text: 'Your address is ' + res[0].formattedAddress};
                    sendRequestcall(sender, messageData, function () {
                        sendRequest(sender, {text: "Give me a phone number to find you and we'll be done"});
                    });

                });
        }
    }

    else if (message.quick_reply) {
        console.log('quick reply :' + message.quick_reply.payload);
        if (message.quick_reply.payload === 'ORDER_FOOD') {
            apiai.apiaiProcessor(sender, message.quick_reply.payload);
        }
        else if(message.quick_reply.payload === 'GET_ORDER'){
            sendRequest(sender, {text: 'done'});
        }
        else {
            let res = message.quick_reply.payload.split("_");
            if(res[0]=== 'REGION'){
                locationProcessor(sender, null, res[2], res[1]);
            }
        }
    }

    else if (message.text) {
        //getProfile(sender);
        console.log('text : ' + message.text);
        apiai.apiaiProcessor(sender, message.text);
    }
};


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

function locationProcessor(sender, address, zipcode, region) {
    if(!address && region && zipcode){
        let messageData = {text: "I'm loading restaurants from "+ region + " for you..."};
        sendRequestcall(sender, messageData, function () {
            resTem.genRestaurantByRegion(region, 0, function (err, results) {
                if (err) throw err;
                else {
                    if (results.attachment.payload.elements.length > 1) {
                        pipeline.data[sender].location = {
                            zip: zipcode,
                            region: region,
                            confirmed: false,
                            value: true
                        };
                        pipeline.data[sender].restaurant.index+=1;
                        sendRequest(sender, results);
                        apiai.apiaiProcessor(sender, 'region is '+ region + " take no action due to quick reply");
                        actions.setLastAction(sender, 'restaurantsShowing', null, []);
                    }
                    else {
                        messageData = {text: "Sorry, delivery in this area is currently off."};
                        sendRequestcall(sender, messageData, function () {
                            sendRequest(sender, genLoc.genGetRegion());
                        });
                    }
                }
            });
        })
    }
    else if(address && zipcode && region){
        let messageData = {text: 'your location is ' + address};
        sendRequestcall(sender, messageData, function () {
            messageData = {text: "I'm loading restaurants for you..."};
            sendRequestcall(sender, messageData, function () {
                resTem.genRestaurantByZip('1111',0, function (err, results) {
                    if (err) throw err;
                    else {
                        if (results.attachment.payload.elements.length > 1) {
                            pipeline.data[sender].location = {
                                address: address,
                                zip: zipcode,
                                region: region,
                                confirmed: false,
                                value: true
                            };
                            pipeline.data[sender].restaurant.index+=1;
                            sendRequest(sender, results);
                            apiai.apiaiProcessor(sender, "The location is traced from get location " + address + ' full confirmation, no action');
                            actions.setLastAction(sender, 'restaurantsShowing', null, []);
                        }
                        else {
                            messageData = {text: "Sorry, I could not find restaurants in this area. You could choose a region"};
                            sendRequestcall(sender, messageData, function () {
                                sendRequest(sender, genLoc.genGetRegion());
                            });
                        }
                    }
                });
            })
        })
    }
    else if(address && region){
        let messageData = {text: 'your location is ' + address};
        sendRequestcall(sender, messageData, function () {
            messageData = {text: "I'm loading restaurants for you..."};
            sendRequestcall(sender, messageData, function () {
                resTem.genRestaurantByRegion(region,0, function (err, results) {
                    if (err) throw err;
                    else {
                        if (results.attachment.payload.elements.length > 1) {
                            pipeline.data[sender].location = {
                                address: address,
                                region: region,
                                confirmed: false,
                                value: true
                            };
                            pipeline.data[sender].restaurant.index+=1;
                            sendRequest(sender, results);
                            apiai.apiaiProcessor(sender, "The location is traced from get location " + address + ' full confirmation, no action');
                            actions.setLastAction(sender, 'restaurantsShowing', null, []);
                        }
                        else {
                            messageData = {text: "Sorry, I could not find restaurants in this area. You could choose a region"};
                            sendRequestcall(sender, messageData, function () {
                                sendRequest(sender, genLoc.genGetRegion());
                            });
                        }
                    }
                });
            })
        })
    }
    else if(address){
        pipeline.data[sender].location = {
            address: address,
            confirmed: true,
            value: true
        };
        let messageData = {text: "Sorry, I could not find restaurants in this area. You could choose a region"};
        sendRequestcall(sender, messageData, function () {
            sendRequest(sender, genLoc.genGetRegion());
        });
    }
}

function sendRequestcall(sender, messageData, callback) {
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
        else {
            callback();
        }
    })
}

