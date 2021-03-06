const mongoose = require('mongoose');

const UpdateMovieSchema = new mongoose.Schema({
    edits : {
        _id: false,
        type: Object,
        required: true,

        name: {
             type: String,
             required: false,
             min: 1,
             max: 100
        },
        year: {
            type: Number,
            required: false
        },
        director: {
            type: String,
            required: false,
            min: 1,
            max: 100
        },
        date: {
            type: Date,
            default: Date.now
        },
        starCast: {
            type: Array,
            required: false
        }
    }
})


module.exports = mongoose.model('UpdateMovie', UpdateMovieSchema);