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
    })
    .catch(err => { // if error we will be here
        console.error('App starting error:', err.stack);
        process.exit(1);
    });


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port);
console.log(`Quijinn listening on ${port}`);

