const mongoose = require('mongoose');
const Movie = require('./Movie');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 250
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 250
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    },
    favorites: [{
        type: mongoose.Types.ObjectId,
        required: false,
        ref: Movie
    }],
    watchlist: [{
        type: mongoose.Types.ObjectId,
        required: false,
        ref: Movie
    }]

});


module.exports = mongoose.model('User', userSchema);