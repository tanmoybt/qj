const pipeline = require('./pipeline');
const request = require('request');

const PAGE_ACCESS_TOKEN = 'EAAcaq8rzMQoBAMr1FgOiTW3Y4rn3fMZApefDoSSqrztUBFD74YaC8wLR50ELPGQwcFrX7qz6JEUbeLZBDaQlimlpYj5ujLZBvOZAW8v2qCvtVhnWaKrYdqgqrQkENlPzqETQZC9A2MdUZAH6UHK42vGq8mcEuV78kCLnc1ZA7xBzwZDZD';

const resTem = require('../templates/genRestaurantTemplate');
const foodTem = require('../templates/genFoodTemplate');
const genWhat = require('../templates/genWhatToDo');
const genLoc = require('../templates/genGetLocation');
const genCart = require('../templates/genCartTemplate');
const apiai = require('./apiai');

module.exports.actionsProcessor= function (sender, action, speech, parameters, resolvedQuery) {
    pipeline.setSenderData(sender);

    if(action.includes('smalltalk') || action === 'input.unknown' || action === 'input.welcome'){
        let messageData = {text: speech};
        sendRequestcall(sender, messageData, function () {
            sendPrevAction(sender);
        })
    }
    else if(action === 'restartBotConfirm'){
        pipeline.resetSenderData(sender);
        let messageData = {text : 'Bot has restarted, your order information is removed'};
        sendRequestcall(sender, messageData, function () {
            apiai.apiResetContext(sender);
            sendRequest(sender, genWhat.genWhatToDo())
        });
    }
    else if(action === 'restartBot'){
        if(pipeline.data[sender]){
            let messageData= {text: speech};
            sendRequest(sender, messageData);
        }
        else {
            let messageData= {text : 'Bot has restarted, your order information is removed'};
            sendRequestcall(sender, messageData, function () {
                apiai.apiResetContext(sender);
                sendRequest(sender, genWhat.genWhatToDo());
            })
        }
    }
    else if(action === 'setOrderGetLocation'){
        pipeline.setSenderData(sender);
        pipeline.data[sender].whattodo= 'ORDER';
        setLastAction(sender, action, speech, parameters);
        sendRequest(sender, genLoc.genGetLocation());

    }

    else if(action === 'setOrderShowOnRegionRestaurants'){
        console.log(parameters.region);
        let messageData = {text: "I'm loading restaurants from "+ parameters.region + "for you..."};
        sendRequest(sender, messageData, function () {
            resTem.genRestaurantByRegion(parameters.region, function (err, results) {
                if (err) throw err;
                else {
                    console.log(JSON.stringify(results, null,2));
                    if (results.attachment.payload.elements.length > 1) {
                        pipeline.data[sender].location = {
                            region: parameters.region,
                            confirmed: false,
                            value: true
                        };
                        sendRequest(sender, results, function () {
                        });
                    }
                    else {
                        messageData = {text: "Sorry, We've not started delivering in this area."};
                        sendRequest(sender, messageData, function () {
                            
                        });
                    }
                }
            });
        })
    }
    else if(action === 'addFoodGetQuantity'){
        let speech = 'You were about to tell me how many ' + pipeline.data[sender].foodattending.food_name + ' you would like';
        setLastAction(sender, 'addFoodGetQuantity', speech, []);
    }

    else if(action === 'addToCart.addToCart-selectnumber'){
        let qu = parameters.number[0];
        console.log(qu);
        let food = pipeline.data[sender].foodattending;
        food.quantity= qu;
        pipeline.data[sender].foods.push(food);
        pipeline.data[sender].foodattending= {};
        setLastAction(sender, 'none', '', []);
        let messageData= {text: qu +' '+ food.food_name + ' in your cart. You can view your cart for checkout or continue shopping.'};
        sendRequest(sender, messageData);
    }
    else if(action === 'addToCart.addToCart-cancel'){
        setLastAction(sender, 'none', '', []);
        let food = pipeline.data[sender].foodattending;
        pipeline.data[sender].foodattending= {};
        let messageData= {text: food.food_name + ' cancelled from order. You can view your cart for checkout or continue shopping.'};
        sendRequest(sender, messageData);
    }
    else if(action === 'changeAmountInCart.changeAmountInCart-selectnumber'){
        let qu = parameters.number[0];
        console.log(qu);
        let food = pipeline.data[sender].foodattending;
        pipeline.data[sender].foods.forEach(function (foodItem) {
            if(foodItem.food_id.equals(food.food_id)){
                foodItem.quantity = qu;
            }
        });
        pipeline.data[sender].foodattending= {};
        setLastAction(sender, 'none', '', []);
        let messageData= {text: qu +' '+ food.food_name + ' in your cart. You can view your cart for checkout or continue shopping.'};
        sendRequest(sender, messageData);
    }
    else if(action === 'changeAmountInCart.changeAmountInCart-cancel'){
        setLastAction(sender, 'none', '', []);
        let food = pipeline.data[sender].foodattending;
        pipeline.data[sender].foodattending= {};
        let messageData= {text: food.food_name + ' kept in order. You can view your cart for checkout or continue shopping.'};
        sendRequest(sender, messageData);
    }
    else if(action === 'deliverylocationConfirm.deliverylocationConfirm-yes'){
        setLastAction(sender, 'none', '', []);
        pipeline.data[sender].location.confirmed = true;
        let messageData= {text: 'The order will be delivered at ' + pipeline.data[sender].location.address};
        sendRequestcall(sender, genCart.genCart(pipeline.data[sender].foods), function () {
            sendRequest(sender, genCart.genConfirmOrder());
        });
    }
    else if(action === 'deliverylocationConfirm.deliverylocationConfirm-no'){
        setLastAction(sender, 'none', '', []);
        pipeline.data[sender].location.confirmed = false;
        sendRequest(sender, genLoc.genGetAddress());
    }
    else if(action === 'deliveryLocationNoGetAddress'){
        if(parameters.address){
            pipeline.data[sender].location.address = parameters.address;
            pipeline.data[sender].location.confirmed = true;
            let messageData = {text: 'What is the best phone number to reach you? '};
            sendRequest(sender, messageData);
            apiai.apiaiProcessor(sender, messageData.text);
            // sendRequestcall(sender, genCart.genCart(pipeline.data[sender].foods), function () {
            //     sendRequest(sender, genCart.genConfirmOrder());
            // });

        }
    }
    else if(action === 'onCheckoutGotAddress'){
        pipeline.data[sender].location.address = resolvedQuery;
        pipeline.data[sender].location.confirmed = true;
        let messageData = {text: 'What is the best phone number to reach you? '};
        sendRequest(sender, messageData);
        apiai.apiaiProcessor(sender, messageData.text);
    }
    else if(action === 'deliverygetphoneNumber'){
        pipeline.data[sender].phone = parameters.phone-number;
        sendRequestcall(sender, genCart.genCart(pipeline.data[sender].foods), function () {
            sendRequest(sender, genCart.genConfirmOrder());
        });
    }
};

function setLastAction(sender, action, speech, parameters) {
    pipeline.data[sender].lastactiontaken = {
        action: action,
        parameters: parameters,
        speech: speech
    };
}

module.exports.setLastAction = setLastAction;

function sendPrevAction(sender){
    if(pipeline.data[sender]){
        if (pipeline.data[sender].lastactiontaken.action){
            let action = pipeline.data[sender].lastactiontaken.action;
            let speech = pipeline.data[sender].lastactiontaken.speech;
            let parameters = pipeline.data[sender].lastactiontaken.parameters;

            if(action === 'setOrderGetLocation'){
                sendRequest(sender, genLoc.genGetLocation(), function () {});
            }
            else if(action === 'addFoodGetQuantity'){
                sendRequest(sender, {text: speech});
            }
        }
        else {
            sendRequest(sender,genWhat.genWhatToDo());
        }
    }
    else{
        sendRequest(sender,genWhat.genWhatToDo());
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
