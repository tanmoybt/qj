'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const IngredientTagSchema = new Schema({
    tag: String,
    image: String
});

module.exports = mongoose.model('Ingredient_Tags', IngredientTagSchema);

