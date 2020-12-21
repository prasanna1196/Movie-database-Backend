const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Movie = require('../model/Movie');
const verify = require('./verifyToken');
const User = require('../model/User');


// Add movies to favorites list
router.post('/', verify, (req, res) => {
    const movieName = {
        name: req.body.name
    }

    Movie.findOne({ name: movieName.name })
        .then(movie => {
            if (!movie) return res.json('Movie does not exist');

            User.findOne({ favorites: movie._id, _id: req.user._id })
                .then(present => {

                    if (present) return res.json('Movie already exists in Favorites');

                    // Working code from here............................
                    User.findByIdAndUpdate(req.user._id,
                        { $push: { favorites: movie._id } },
                        { useFindAndModify: false })
                        .then(() => res.json("Movie added to favorites"))
                })
            // till here...........................................

        })
})

// Get favorite movies
router.get('/', verify, (req, res) => {
    User.findById(req.user)
        .populate('favorites')
        .exec((err, user) => {
            if (err) return res.json(err)
            res.json({
                name: user.name,
                email: user.email,
                favorites: user.favorites
            });
        })
});

// Delete a movie
router.delete('/:name', verify, (req, res) => {
    Movie.findOne({ name: req.params.name }).
        then(movie => {
            if (!movie) {
                return res.status(400).send('Movie not found');
            } else {
                User.findByIdAndUpdate(req.user._id,
                    { $pull: { favorites: movie._id } },
                    { new: true, useFindAndModify: false }
                ).then(() => res.json("Movie deleted from Favorites"));
            }
        })
});


module.exports = router;