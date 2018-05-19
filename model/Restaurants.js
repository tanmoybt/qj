'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;


const RestaurantsSchema = new Schema({
    name: String,
    location: String,
    region: String,
    zip_code: String,
    cuisine: [String],
    rating: Number,
    start_time: String,
    close_time: String,
    email: String,
    phone: String,
    logo: String,
    image: String,
    description: String,
    offer: String
});

RestaurantsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Restaurant', RestaurantsSchema);