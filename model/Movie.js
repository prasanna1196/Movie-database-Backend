const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 100
    },
    year: {
        type: Number,
        required: true,
    },
    director: {
        type: String,
        required: true,
        min: 1,
        max: 100
    },
    date: {
        type: Date,
        default: Date.now
    },
    starCast: {
        type: Array
    }
})

module.exports = mongoose.model('Movie', movieSchema);