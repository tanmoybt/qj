module.exports.resTem = function () {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": "Star kabab",
                        "image_url": "http://www.deshigifts.com/wp-content/uploads/2016/07/STAR-HOTEL-KABAB.jpg",
                        "subtitle": "great kababs",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Pick",
                                "payload": "Star Kabab"
                            }
                        ]
                    }
                ]
            }
        }
    };
    return messageData;
};