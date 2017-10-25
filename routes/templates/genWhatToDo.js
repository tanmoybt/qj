

module.exports.genWhatToDo = function () {
    return {
        "text": "Hi what would you do?",
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