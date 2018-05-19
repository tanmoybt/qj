'use strict';
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;


const ProfilesSchema = new Schema({
    first_name: String,
    last_name: String,
    sender_id: String
});

ProfilesSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Profiles', ProfilesSchema);

