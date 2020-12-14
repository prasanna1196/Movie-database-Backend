const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    
    name: {
        type: String,
        //required: true,
        min: 1,
        max: 100
    },
    year: {
        type: Number,
        //required: true,
    },
    director: {
        type: String,
        //required: true,
        min: 1,
        max: 100
    },
    date: {
        type: Date,
        default: Date.now
    },
    starCast: {
        type: Array,
        //required: true
    }
})

module.exports = mongoose.model('Favorite', favoriteSchema)