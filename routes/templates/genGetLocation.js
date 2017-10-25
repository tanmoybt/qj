

module.exports.genGetLocation = function () {
    return {
        "text": "Please share your location:",
        "quick_replies": [
            {
                "content_type": "location",
            },
            {
                "content_type": "text",
                "title": "Dhanmondi",
                "payload": "DHANMONDI_1215"
            },
            {
                "content_type": "text",
                "title": "University",
                "payload": "UNIVERSITY_1111"
            }
        ]
    };
};
