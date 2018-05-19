'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CuisineSchema = new Schema({
    cuisine: String,
    image: String
});

module.exports = mongoose.model('Cuisines', CuisineSchema);

