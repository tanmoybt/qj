const apiaiApp = require('apiai')('67efa2ecd2514286b05cb58fdc3643fc');
const pipeline = require('./pipeline');
const request = require('request');

const PAGE_ACCESS_TOKEN = 'EAAcaq8rzMQoBAMr1FgOiTW3Y4rn3fMZApefDoSSqrztUBFD74YaC8wLR50ELPGQwcFrX7qz6JEUbeLZBDaQlimlpYj5ujLZBvOZAW8v2qCvtVhnWaKrYdqgqrQkENlPzqETQZC9A2MdUZAH6UHK42vGq8mcEuV78kCLnc1ZA7xBzwZDZD';

const resTem = require('../templates/genRestaurantTemplate');
const foodTem = require('../templates/genFoodTemplate');
const genWhat = require('../templates/genWhatToDo');
const genLoc = require('../templates/genGetLocation');
const genCart = require('../templates/genCartTemplate');

module.exports.apiaiProcessor = function (sender, text) {
    let apiai = apiaiApp.textRequest(text, {
        sessionId: sender // use any arbitrary id
    });

    apiai.on('response', (response) => {
        let speech = response.result.fulfillment.speech;
        let action = response.result.action;
        console.log('from api :');
        console.log(JSON.stringify(response, null, 2));
        //console.log(data[sender]);
        actionProcessor(sender, action, speech);
    });

    apiai.on('error', (error) => {
        console.log(error);
    });

    apiai.end();
};

function actionProcessor(sender, action, speech) {
    if(action === 'restartBotConfirm'){
        delete pipeline.data[sender];
        let messageData = {text: speech};
        sendRequest(sender, messageData, function () {
            sendRequest(sender, genWhat.genWhatToDo(), function () {
                
            })
        });

    }
    else if(action === 'restartBot'){
        let messageData = {text: speech};
        sendRequest(sender, messageData, function () {
            console.log('nth');
        });
    }
}

function sendRequest(sender, messageData, callback) {
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