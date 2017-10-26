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
                if (res[0].zipcode) {
                    resTem.genRestaurantByZip('1111', function (err, results) {
                        if (err) throw err;
                        else {
                            sendRequest(sender, results);
                        }
                    });
                }
            });
    }
    else if (message.quick_reply) {
        console.log('quick reply :' + message.quick_reply.payload);
        if (message.quick_reply.payload === 'ORDER_FOOD') {
            sendRequest(sender, genLoc.genGetLocation());
        }
    }
    else if (message.text) {
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