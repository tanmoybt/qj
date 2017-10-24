'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RestaurantsSchema = new Schema({
    name: String,
    location: String,
    region: String,
    zip_code: String,
    cuisine: String,
    rating: Number,
    logo: String,
    image: String
});

module.exports = mongoose.model('Restaurant', RestaurantsSchema);