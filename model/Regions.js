'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RegionsSchema = new Schema({
    name: String,
    zip_code: String,
    sub_zip_codes: [],
    sub_regions: []
});

module.exports = mongoose.model('Regions', RegionsSchema);