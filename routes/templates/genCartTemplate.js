let pipeline = require('../facebook/pipeline');


module.exports.genCart = function (foods) {
    if (!foods.size) {
        let amount = 0;
        let messageElements = foods.map(food => {
            amount += food.quantity * food.price;

            return (
                {
                    "title": food.food_name,
                    "subtitle": "great food",
                    "quantity": food.quantity,
                    "price": food.price,
                    "currency": "USD",
                    "image_url": food.image_url
                }
            )
        });
        return {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "receipt",
                    "recipient_name": "Anjan",
                    "order_number": "12345678902",
                    "currency": "USD",
                    "payment_method": "Pay on Delivery",
                    "order_url": "http://petersapparel.parseapp.com/order?order_id=123456",
                    "timestamp": "1428444852",
                    "address": {
                        "street_1": "49",
                        "street_2": "Kawran Bazaar",
                        "city": "Dhaka",
                        "postal_code": "1215",
                        "state": "Dhaka",
                        "country": "BD"
                    },
                    "summary": {
                        "subtotal": amount,
                        "shipping_cost": 100,
                        "total_tax": 0,
                        "total_cost": amount + 100
                    },
                    "adjustments": [
                        {
                            "name": "Special Discount",
                            "amount": 100
                        },
                        {
                            "name": "$10 Off Coupon",
                            "amount": 10
                        }
                    ],
                    "elements": messageElements
                }
            }
        }
    }
    else {
        return [];
    }
};

module.exports.genCartCarousel = function (foods) {
    if (!foods.size) {
        let amount = 0;

        let messageElements = foods.map(food => {
            amount += food.quantity * food.price;

            return (
                {
                    "title": food.food_name + ', Qty. ' + food.quantity + ', price: Tk ' + food.price,
                    "subtitle": food.cuisine + ', Rating :' + food.rating,
                    "image_url": "https://media-cdn.tripadvisor.com/media/photo-s/0a/56/44/5a/restaurant.jpg",
                    "default_action": {
                        "type": "web_url",
                        "url": "fb.com/anjantb",
                        "messenger_extensions": false,
                        "webview_height_ratio": "compact"
                    },
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Change amount",
                            "payload": 'CHANGE_' + food.food_id
                        },
                        {
                            "type": "postback",
                            "title": "Remove Item",
                            "payload": 'REMOVE_' + food.food_id
                        }
                    ]
                }
            )
        });
        let messelements =
            {
                "title": 'Cart total : Tk ' + amount + ' from restaurant',
                "subtitle": 'hi',
                "image_url": "https://media-cdn.tripadvisor.com/media/photo-s/0a/56/44/5a/restaurant.jpg",
                "default_action": {
                    "type": "web_url",
                    "url": "fb.com/anjantb",
                    "messenger_extensions": false,
                    "webview_height_ratio": "compact"
                },
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Checkout",
                        "payload": 'CHECKOUT'
                    },
                    {
                        "type": "postback",
                        "title": "Cancel",
                        "payload": 'CANCEL_CART'
                    }
                ]
            };

        messageElements.splice(0, 0, messelements);

        return {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": messageElements
                }
            }
        }
    }
    else {
        return [];
    }
};

module.exports.genConfirmOrder = function () {
    return {
        "text": "Would you like to get the order?",
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Get my Order",
                "payload": "GET_ORDER"
            }
        ]
    };
};


