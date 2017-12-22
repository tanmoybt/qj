'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FoodTagSchema = new Schema({
    tag: String,
    image: String
});

module.exports = mongoose.model('Food_Tags', FoodTagSchema);

