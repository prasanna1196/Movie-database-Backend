const mongoose = require('mongoose');
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
    favorites: {
        _id: false,
        type: Array,
        required: false,
        favorite : {
            _id: false,
            type: Object,
            required: false,
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
    }

});


module.exports = mongoose.model('User', userSchema);