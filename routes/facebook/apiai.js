const apiaiApp = require('apiai')('67efa2ecd2514286b05cb58fdc3643fc');
const actions = require('./actions');


module.exports.apiaiProcessor = function (sender, text) {
    let apiai = apiaiApp.textRequest(text, {
        sessionId: sender // use any arbitrary id
    });

    apiai.on('response', (response) => {
        let speech = response.result.fulfillment.speech;
        let action = response.result.action;
        console.log('from api :');
        console.log(JSON.stringify(response, null, 2));
        //console.log(data[sender]);
        actions.actionsProcessor(sender, action, speech);
    });

    apiai.on('error', (error) => {
        console.log(error);
    });

    apiai.end();
};