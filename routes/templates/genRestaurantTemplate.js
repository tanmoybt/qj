const Restaurant = require('../../model/Restaurants');
const Food = require('../../model/Foods');

module.exports.genRestaurantByRegion = function (region, callback) {
    let perPage = 4;
    let page = 0;
    Restaurant.find({region : region})
        .limit(perPage)
        .skip(perPage * page)
        .exec(function (err, restaurants) {
            callback(err, makeTemplate(restaurants));
        })
};

module.exports.genRestaurantByZip = function (zip, callback) {
    let perPage = 4;
    let page = 0;
    Restaurant.find({zip_code : zip})
        .limit(perPage)
        .skip(perPage * page)
        .exec(function (err, restaurants) {
            callback(err, makeTemplate(restaurants));
        })
};

module.exports.genRestaurantByCuisine = function (cuisine, callback) {
    let perPage = 4;
    let page = 0;
    Restaurant.find({cuisine : cuisine})
        .limit(perPage)
        .skip(perPage * page)
        .exec(function (err, restaurants) {
            callback(err, makeTemplate(restaurants));
        })
};

function makeTemplate(restaurants) {
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
                    "buttons":
                        [
                            {
                                "title": "View More",
                                "type": "postback",
                                "payload": "SEE_MORE"
                            }
                        ]
                }
            }
        }
    }
    else {
        return [];
    }
}

