let data = [];

module.exports.data = data;

module.exports.setSenderData = function (sender) {
    if (!data[sender]) {
        data[sender] =
            {
                whattodo: '',
                name : '',
                lastactiontaken: {
                    action:'', speech:'', parameters: []
                },
                location: {
                    address: '', zip: '', confirmed: false, value: false
                },
                restaurant: { index: 0,
                    res_id: '', name: '', image_url: '', confirmed: false
                },
                foodattending: '',
                phone: '',
                foods: []
            };
    }
};

module.exports.resetSenderData = function (sender) {
    data[sender] =
        {
            whattodo: '',
            lastactiontaken: {
                action:'', speech:'', parameters: []
            },
            name : '',
            location: {
                address: '', zip: '', confirmed: false, value: false
            },
            foodattending: {},
            restaurant: { index: 0,
                res_id: '', name: '', image_url: '', confirmed: false
            },
            phone: '',
            foods: []
        };
};