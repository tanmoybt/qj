const Restaurant = require('../../model/Restaurants');
const Food = require('../../model/Foods');

module.exports.genRestaurantByRegion = function (region, index, callback) {
    let perPage = 4;
    let page = index+1;
    Restaurant.paginate({region : region}, { page: page, limit: perPage }, function(err, result) {
        // result.docs
        // result.total
        // result.limit - 10
        // result.page - 3
        // result.pages
        console.log(result.total);
        if(result.total > (page)*perPage){
            callback(err, makeTemplate(result.docs, true));
        }
        else {
            callback(err, makeTemplate(result.docs, false));
        }
    });
};

module.exports.genRestaurantByZip = function (zip, index, callback) {
    let perPage = 4;
    let page = index+1;
    Restaurant.paginate({zip_code : zip}, { page: page, limit: perPage }, function(err, result) {
        // result.docs
        // result.total
        // result.limit - 10
        // result.page - 3
        // result.pages
        console.log(result.total);
        if(result.total > (page)*perPage){
            callback(err, makeTemplate(result.docs, true));
        }
        else {
            callback(err, makeTemplate(result.docs, false));
        }
    });
};

module.exports.genRestaurantByCuisine = function (cuisine,index, callback) {
    let perPage = 4;
    let page = index+1;
    Restaurant.paginate({cuisine : cuisine}, { page: page, limit: perPage }, function(err, result) {
        // result.docs
        // result.total
        // result.limit - 10
        // result.page - 3
        // result.pages
        console.log(result.total);
        if(result.total > (page)*perPage){
            callback(err, makeTemplate(result.docs, true));
        }
        else {
            callback(err, makeTemplate(result.docs, false));
        }
    });

};

function makeTemplate(restaurants, viewFlag) {
    let view= [];
    if (viewFlag){
        view = [
            {
                "title": "View More",
                "type": "postback",
                "payload": "SEE_MORE"
            }
        ]
    }
    if(!restaurants.size) {
        let messageElements = restaurants.map(restaurant => {
            return (
                {
                    "title": restaurant.name,
                    "subtitle": restaurant.cuisine + ', Rating :' + restaurant.rating + ', ' + restaurant.region,
                    "image_url": "https://media-cdn.tripadvisor.com/media/photo-s/0a/56/44/5a/restaurant.jpg",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Pick",
                            "payload": restaurant.name
                        }
                    ]
                }
            )
        });
        return {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "compact",
                    "elements": messageElements,
                    "buttons": view
                }
            }
        }
    }
    else {
        return [];
    }
}

