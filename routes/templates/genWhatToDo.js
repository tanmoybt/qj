

module.exports.genWhatToDo = function () {
    return {
        "text": "Hi, :D how can I help you today 🍴🍕🍔🍗🍖🍟?",
        "quick_replies": [
            {
                "content_type": "text",
                "title": "ORDER FOOD",
                "payload": "ORDER_FOOD"
            },
            {
                "content_type": "text",
                "title": "BOOK TABLE",
                "payload": "BOOK_TABLE"
            }
        ]
    };
};

module.exports.genGetStarted = function (name) {
    return {
        "text": 'Hello ' + name+   "😍😁😈 I'm Quijinn, Oder me foods from resturants around your location 🍴🍕🍔🍗🍖🍟",
        "quick_replies": [
            {
                "content_type": "text",
                "title": "ORDER FOOD",
                "payload": "ORDER_FOOD"
            },
            {
                "content_type": "text",
                "title": "BOOK TABLE",
                "payload": "BOOK_TABLE"
            }
        ]
    };
};