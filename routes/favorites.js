const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Movie = require('../model/Movie');
const Favorite = require('../model/Favorite');
const verify = require('./verifyToken');
const User = require('../model/User');


// Add movies to favorites list
router.post('/', verify, (req, res) => {
    const mName = {
        name: req.body.name
    }
    // User.findById(req.user._id)
    //     .then(person => {
            //res.json(person);
            // person.favorites.findOne({ name: mName.name })
            //     .then(data => {
            //         if (data) return res.send('Movie already exists');
            //         res.json('empty')

                    Movie.findOne({ name: mName.name })
                        .then(result => {
                            if (!result) return res.json('Movie does not exist');
                            const fav = {favorite: result}

                            // User.findById(req.user._id)
                            //     .populate('favorites', '_id')
                            //         .exec((err, stfu) => {
                            //             res.json(stfu)
                            //         })
                                






                            // Working code from here............................
                            User.findByIdAndUpdate(req.user._id,
                                { $push :{favorites : result._id } },
                                {useFindAndModify: false})
                                .then(blah => res.json(blah))
                        })
                            // till here...........................................
                
        // })

//     Favorite.findOne({ name: mName.name })
//         .then(data => {
//             if (data) return res.send('Movie already exists');

//             Movie.findOne({ name: mName.name })
//                 .then(result => {
//                     if (!result) return res.send('Movie does not exist');

//                     Favorite.insertMany(result)
//                     res.json(result)
//                 })
//         })
})

// Get favorite movies
router.get('/', verify, (req, res) => {
    // Favorite.find()
    //     .then(results => {
    //         if (results.length < 1) return res.send('Nothing here');

    //         res.status(200).json(results);

    //     })
    //     .catch(err => {
    //         res.send(err);
    //     })
    User.findById(req.user)
        .then(data => res.json({
            name: data.name,
            favorites: data.favorites
        }))

});

// Delete a movie
router.delete('/:name', verify, (req, res) => {
    Movie.findOne({ name: req.params.name }).
        then(doc => {
            if (!doc) {
                return res.status(400).send('Movie not found');
            } else {
                User.findByIdAndUpdate(req.user._id,
                    { $pull : {favorites: doc._id}},
                    {new: true, useFindAndModify:false}
                ).then(data => res.json(data));               
            }
        })
});

module.exports = router;