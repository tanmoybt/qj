const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://tanmoy12:asdfgh123456@ds119395.mlab.com:19395/quijinndata', { useMongoClient: true })
    .then(() => { // if all is ok we will be here
        console.log('Start');
        // const genRes = require('./routes/templates/genRestaurantTemplate');
        // genRes.genRestaurantByZip('1111', function(err, result){
        //     if(err) console.log(err);
        //     else {
        //         console.log(JSON.stringify(result, null,2));
        //     }
        // });
    })
    .catch(err => { // if error we will be here
        console.error('App starting error:', err.stack);
        process.exit(1);
    });


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept,' +
        'X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


// Serve static files from the React app

app.use(express.static(path.join(__dirname, 'client/build')));
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

app.use(express.static(process.cwd() + '/public'));

const webhook = require('./routes/facebook/webhook');
app.use('/webhook', webhook);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port);
console.log(`Quijinn listening on ${port}`);

