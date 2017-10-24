'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FoodsSchema = new Schema({
    res_id: Schema.Types.ObjectId,
    food_name: String,
    food_type: String,
    food_size: String,
    rating: Number,
    price: Number,
    index: Number,
    image: String,
    cuisine: String
});

module.exports = mongoose.model('Foods', FoodsSchema);