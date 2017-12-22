const apiaiApp = require('apiai')('67efa2ecd2514286b05cb58fdc3643fc');
const actions = require('./actions');


module.exports.apiaiProcessor = function (sender, text) {
    let apiai = apiaiApp.textRequest(text, {
        sessionId: sender // use any arbitrary id
    });

    apiai.on('response', (response) => {
        let speech = response.result.fulfillment.speech;
        let action = response.result.action;
        let parameters = response.result.parameters;
        let resolvedQuery = response.result.resolvedQuery;
        console.log('from api :');
        console.log(JSON.stringify(response, null, 2));
        //console.log(data[sender]);
        actions.actionsProcessor(sender, action, speech, parameters, resolvedQuery);
    });

    apiai.on('error', (error) => {
        console.log(error);
    });

    apiai.end();
};

module.exports.apiResetContext = function (sender) {
    let options = {
        sessionId: sender
    };

    let request = apiaiApp.deleteContextsRequest(options);

    request.on('response', function(response) {
        console.log(response);
    });

    request.on('error', function(error) {
        console.log(error);
    });

    request.end();
};