'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
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

RestaurantsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Restaurant', RestaurantsSchema);