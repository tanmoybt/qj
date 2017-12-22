const request = require('request');
const pipeline = require('./pipeline');
const apiai = require('./apiai');
const actions = require('./actions');
const Profile = require('../../model/Profiles');

const PAGE_ACCESS_TOKEN = 'EAAcaq8rzMQoBAMr1FgOiTW3Y4rn3fMZApefDoSSqrztUBFD74YaC8wLR50ELPGQwcFrX7qz6JEUbeLZBDaQlimlpYj5ujLZBvOZAW8v2qCvtVhnWaKrYdqgqrQkENlPzqETQZC9A2MdUZAH6UHK42vGq8mcEuV78kCLnc1ZA7xBzwZDZD';
const resTem = require('../templates/genRestaurantTemplate');
const foodTem = require('../templates/genFoodTemplate');
const genWhat = require('../templates/genWhatToDo');
const genLoc = require('../templates/genGetLocation');
const genCart = require('../templates/genCartTemplate');

module.exports.postbackProcessor = function (sender, postback) {
    if(postback.payload === 'GET_STARTED_PAYLOAD'){
        getProfile(sender, function (name) {
            pipeline.setSenderData(sender);
            let nameFormatted= name.first_name + ' '+ name.last_name;
            pipeline.data[sender].name = nameFormatted;


            sendRequestcall(sender, genWhat.genGetStarted(nameFormatted), function () {
                const profile = new Profile();
                profile.first_name = name.first_name;
                profile.last_name = name.first_name;
                profile.sender_id= sender;

                console.log(profile);
                profile.save(function(err) {});
            });
        });
    }

    else if (postback.title === 'Add to cart') {
        pipeline.setSenderData(sender);
        console.log('Food : ' + postback.payload);
        foodTem.findFoodByID(postback.payload, function (err, food) {
            if (err) throw err;
            console.log(food);
            console.log('more: ' + JSON.stringify(pipeline.data[sender], null,2));
            let flag = true;
            pipeline.data[sender].foods.forEach(function (foodItem) {
                console.log((typeof foodItem.food_id)+' ' +foodItem.food_id);
                console.log((typeof food.food_id)+' ' +food.food_id);
                if(foodItem.food_id.equals(food.food_id)){
                    console.log('falsify');
                    flag= false;
                }
            });
            if(flag){
                pipeline.data[sender].foodattending= food;

                apiai.apiaiProcessor(sender, 'add ' + food.food_name + ' to my cart, confirm');

                let messageData= {text: 'How many of '+ food.food_name+ " would you order?"};
                sendRequest(sender, messageData);

            }
            else {
                let messageData= {text: food.food_name+ " is already in your cart. To modify visit cart"};
                sendRequest(sender, messageData);
            }

        });
    }

    else if (postback.title === 'Pick') {
        console.log('Restaurant : ' + postback.payload);
        foodTem.genFoodByRestaurant(postback.payload, function (err, results) {
            if (err) throw err;
            else {
                //apiai.apiaiProcessor(sender, 'The restaurant ' + postback.payload+ ' is picked, traced to no action');
                let messageData = {text: "I'm loading food menu for restaurant "  + postback.payload + ". Pick other restaurants and see their menu. "};
                sendRequestcall(sender, messageData, function () {
                    sendRequest(sender, results);
                });
            }
        });
    }

    else if (postback.title === 'View cart') {
        console.log('cart : ' + postback.payload);
        if (pipeline.data[sender] && pipeline.data[sender].foods) {
            sendRequest(sender, genCart.genCartCarousel(pipeline.data[sender].foods));
        }
        else {
            let messageData = {text: 'Nothing on your cart'};
            sendRequest(sender, messageData);
        }
    }

    else if (postback.title === 'Restart bot') {
        if (pipeline.data[sender]) {
            apiai.apiaiProcessor(sender, postback.title);
        }
        else {
            actions.actionsProcessor(sender, 'restartBotConfirm', 'Bot Restarted');
        }
    }

    else if (postback.title === 'View More') {
        if (pipeline.data[sender]) {
            viewMoreProcessor(sender, pipeline.data[sender].location.address,
                pipeline.data[sender].location.zip, pipeline.data[sender].location.region);
        }
        else {
            actions.actionsProcessor(sender, 'restartBotConfirm', 'Bot Restarted');
        }
    }

    else if (postback.payload.includes('CHANGE')){
        let res =postback.payload.split('_');
        let flag = false;
        let food;
        pipeline.data[sender].foods.forEach(function (foodItem) {
            if(foodItem.food_id.equals(res[1])){
                console.log('falsify');
                food= foodItem;
                flag= true;
            }
        });
        if(flag){
            pipeline.data[sender].foodattending= food;

            apiai.apiaiProcessor(sender, 'change the amount of this item ' + food.food_name + ' from '+ food.quantity+' confirm on cart ready');

            let messageData= {text: 'You currently have '+food.quantity+' '+ food.food_name+ " in your cart now, How many would you order?"};
            sendRequest(sender, messageData);

        }
        else {
            let messageData= {text: food.food_name+ " not found in Cart"};
            sendRequest(sender, messageData);
        }
    }

    else if (postback.payload.includes('REMOVE')){
        let res =postback.payload.split('_');
        let flag = false;
        let food;
        let foodIndex=0;
        let index=0;
        pipeline.data[sender].foods.forEach(function (foodItem) {
            if(foodItem.food_id.equals(res[1])){
                food= foodItem;
                flag=true;
                foodIndex = index;
            }
            index++;
        });
        if(flag){
            pipeline.data[sender].foods.splice(foodIndex, 1);
            let messageData= {text: food.food_name+ " removed from cart."};
            sendRequestcall(sender, messageData, function () {
                sendRequest(sender, genCart.genCartCarousel(pipeline.data[sender].foods));
            });
        }
        else {
            let messageData= {text: food.food_name+ " not found in Cart"};
            sendRequest(sender, messageData);
        }
    }

    else if (postback.payload ==='CHECKOUT'){
        if(pipeline.data[sender].foods.length>0){
            if(pipeline.data[sender].location.address && !pipeline.data[sender].location.confirmed){
                apiai.apiaiProcessor(sender, 'ready for checkout, the address is ' + pipeline.data[sender].location.address);
                let messageData = {text: 'Great! Would you like delivery at this address : '+ pipeline.data[sender].location.address};
                sendRequest(sender, messageData);
            }
            else {
                apiai.apiaiProcessor(sender, 'ready for checkout, without an addrress');
                sendRequest(sender, genLoc.genGetAddress());
            }
        }
        else {
            let messageData = {text: "Please add items to cart for checkout"};
            sendRequest(sender, messageData);
        }
    }

    else if (postback.payload === 'GET_ORDER'){
        sendRequest(sender, {text: ':D'});
    }
};

function viewMoreProcessor(sender, address, zipcode, region) {
    if (!address && region && zipcode) {
        resTem.genRestaurantByRegion(region, pipeline.data[sender].restaurant.index, function (err, results) {
            if (err) throw err;
            else {
                if (results.attachment.payload.elements.length > 1) {
                    pipeline.data[sender].restaurant.index += 1;
                    sendRequest(sender, results);
                }
                else {
                    let messageData = {text: "Sorry, No more restaurants, select from the previous list"};
                    sendRequest(sender, messageData);
                }
            }
        });
    }
    else if (address && zipcode && region) {
        resTem.genRestaurantByZip('1111', pipeline.data[sender].restaurant.index, function (err, results) {
            if (err) throw err;
            else {
                if (results.attachment.payload.elements.length > 1) {
                    pipeline.data[sender].restaurant.index++;
                    sendRequest(sender, results);
                }
                else {
                    let messageData = {text: "Sorry, No more restaurants, select from the previous list"};
                    sendRequest(sender, messageData);
                }
            }
        });
    }
    else if (address && region) {
        resTem.genRestaurantByRegion(region, pipeline.data[sender].restaurant.index, function (err, results) {
            if (err) throw err;
            else {
                if (results.attachment.payload.elements.length > 1) {

                    pipeline.data[sender].restaurant.index++;
                    sendRequest(sender, results);
                }
                else {
                    let messageData = {text: "Sorry, No more restaurants, select from the previous list"};
                    sendRequest(sender, messageData);
                }
            }
        });
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

function getProfile(PSID, callback){
    let link = "https://graph.facebook.com/v2.6/" + PSID + "?fields=first_name,last_name,profile_pic&access_token=" +PAGE_ACCESS_TOKEN;
    //console.log(link);
    let name;
    request(link, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log(JSON.parse(body, null, 2));
        let info = JSON.parse(body, null, 2);
        //console.log(JSON.parse(response, null, 2));// Print the HTML for the Google homepage.
        console.log(info.first_name);
        console.log(info.last_name);
        if(body){
            name= {
                first_name: info.first_name,
                last_name: info.last_name
            };
        }
        callback(name);
    });


}