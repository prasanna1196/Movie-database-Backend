const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    // _id: {
    //     type: mongoose.Types.ObjectId
    // },
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
        type: Array,
        required: true
    }
})



module.exports = mongoose.model('Movie', movieSchema);
