let pipeline = require('../facebook/pipeline');


module.exports.genCart= function (foods) {
    if(!foods.size) {
        let amount = 0;
        let messageElements = foods.map(food => {
            amount += food.quantity * food.price;

            return (
                {
                    "title": food.food_name,
                    "subtitle":"great food",
                    "quantity":food.quantity,
                    "price":food.price,
                    "currency": "USD",
                    "image_url": food.image_url
                }
            )
        });
        return {
            "attachment":{
                "type":"template",
                "payload":{
                    "template_type":"receipt",
                    "recipient_name":"Anjan",
                    "order_number":"12345678902",
                    "currency": "USD",
                    "payment_method" : "Pay on Delivery",
                    "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
                    "timestamp":"1428444852",
                    "address":{
                        "street_1":"49",
                        "street_2":"Kawran Bazaar",
                        "city":"Dhaka",
                        "postal_code":"1215",
                        "state":"Dhaka",
                        "country":"BD"
                    },
                    "summary":{
                        "subtotal":amount,
                        "shipping_cost": 100,
                        "total_tax": 0,
                        "total_cost": amount+100
                    },
                    "adjustments":[
                        {
                            "name":"Special Discount",
                            "amount": 100
                        },
                        {
                            "name":"$10 Off Coupon",
                            "amount":10
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


