

module.exports.genGetLocation = function () {
    return {
        "text": "Please share your location so I can find restaurants for you:",
        "quick_replies": [
            {
                "content_type": "location",
            },
            {
                "content_type": "text",
                "title": "Dhanmondi",
                "payload": "REGION_Dhanmondi_1215"
            },
            {
                "content_type": "text",
                "title": "University",
                "payload": "REGION_University_1111"
            }
        ]
    };
};

module.exports.genGetRegion = function () {
    return {
        "text": "Please select a region to find restaurants in",
        "quick_replies": [
            {
                "content_type": "text",
                "title": "Dhanmondi",
                "payload": "REGION_Dhanmondi_1215"
            },
            {
                "content_type": "text",
                "title": "University",
                "payload": "REGION_University_1111"
            }
        ]
    };
};

module.exports.genGetAddress = function () {
    return {
        "text": "Please share your location if you'd like delivery at your place, Or tell me an address of delivery:",
        "quick_replies": [
            {
                "content_type": "location",
            }
        ]
    };
};

