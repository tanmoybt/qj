'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FoodsSchema = new Schema({
    res_id: Objectid,
    name: String,
    rating: Number,
    price: Number,
    subitems: [String],
    image: String
});

module.exports = mongoose.model('Foods', FoodsSchema);