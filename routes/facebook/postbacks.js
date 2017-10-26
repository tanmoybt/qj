const request = require('request');
const pipeline = require('./pipeline');
const apiai = require('./apiai');

const PAGE_ACCESS_TOKEN = 'EAAcaq8rzMQoBAMr1FgOiTW3Y4rn3fMZApefDoSSqrztUBFD74YaC8wLR50ELPGQwcFrX7qz6JEUbeLZBDaQlimlpYj5ujLZBvOZAW8v2qCvtVhnWaKrYdqgqrQkENlPzqETQZC9A2MdUZAH6UHK42vGq8mcEuV78kCLnc1ZA7xBzwZDZD';
const resTem = require('../templates/genRestaurantTemplate');
const foodTem = require('../templates/genFoodTemplate');
const genWhat = require('../templates/genWhatToDo');
const genLoc = require('../templates/genGetLocation');
const genCart = require('../templates/genCartTemplate');

module.exports.postbackProcessor = function (sender, postback) {
    if(postback.title === 'Add to cart'){
        console.log('Food : '+ postback.payload);
        if(!pipeline.data[sender]){
            pipeline.data[sender] = [];
        }
        foodTem.findFoodByID(postback.payload, function (err, food) {
            if(err) throw err;
            console.log(food);
            if(pipeline.data[sender].foods){
                pipeline.data[sender].foods.push(food);
                console.log('more: '+pipeline.data[sender]);
            }
            else{
                pipeline.data[sender] = {
                    foods : [food]
                };
                console.log('1st' + pipeline.data[sender]);
            }

        });
    }
    else if(postback.title === 'Pick'){
        console.log('Restaurant : '+ postback.payload);
        foodTem.genFoodByRestaurant(postback.payload, function (err, results) {
            if(err) throw err;
            else {
                sendRequest(sender, results);
            }
        });
    }
    else if(postback.title === 'View cart'){
        console.log('cart : '+ postback.payload);
        if(pipeline.data[sender] && pipeline.data[sender].foods){
            sendRequest(sender, genCart.genCart(pipeline.data[sender].foods));
        }
        else {
            let messageData = {text: 'Nothing on your cart'};
            sendRequest(sender, messageData);
        }
    }
    else if(postback.title === 'Restart bot'){
        if(pipeline.data[sender]){
            apiai.apiaiProcessor(sender, postback.title);
        }
        else {
            let messageData = {text: 'Bot has restarted'};
            sendRequest(sender, messageData);
        }
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