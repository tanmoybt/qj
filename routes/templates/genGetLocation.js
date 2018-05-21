

module.exports.genGetLocation = function () {
    let location_reply= {
                            "content_type": "location"
                        };

    Regions.find(function (err, regions) {
        if (err) return err;
        let replies = makeTemplate(regions);
        replies.unshift(location_reply);

        return {
            "text": "Please select a region to find restaurants in",
            "quick_replies": replies
        };
    
    })

};

module.exports.genGetRegion = function () {
    Regions.find(function (err, regions) {
        if (err) return err;
        let replies = makeTemplate(regions);

        return {
            "text": "Please select a region to find restaurants in",
            "quick_replies": replies
        };
    
    })
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

function makeTemplate(regions) {
    if (!regions.size) {
        let messageElements = regions.map(region => {
            return (
                {
                    "content_type": "text",
                    "title": region.name,
                    "payload": "REGION_" + region.name + "_" + region.zip_code
                }
            )
        });
        return messageElements;
    }
    else {
        return [];
    }
}

