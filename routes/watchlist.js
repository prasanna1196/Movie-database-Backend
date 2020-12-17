const express = require('express');
const router = express.Router();
const Movie = require('../model/Movie');
const verify = require('./verifyToken');
const User = require('../model/User');


// Add movies to Watchlist
router.post('/', verify, (req, res) => {
    const movieName = {
        name: req.body.name
    }
    // User.findById(req.user)
    //     .then(user => {
    //         user.findById({watchlist: req.user._id})
    //             .then(result => res.json(result))
    //     })

    Movie.findOne({ name: movieName.name })
        .then(movie => {
            if (!movie) return res.json('Movie does not exist');

            User.findOne({ watchlist: movie._id, _id: req.user._id })
                .then(present => {

                    if (present) return res.json('Movie already exists in watchlist');

                    // Working code from here............................
                    User.findByIdAndUpdate(req.user._id,
                        { $push: { watchlist: movie._id } },
                        { useFindAndModify: false })
                        .then(() => res.json("Movie added to watchlist"))
                })
            // till here...........................................
        })


    // // Alternate method (Not Recommended..)
    //     Favorite.findOne({ name: movieName.name })
    //         .then(data => {
    //             if (data) return res.send('Movie already exists');

    //             Movie.findOne({ name: movieName.name })
    //                 .then(result => {
    //                     if (!result) return res.send('Movie does not exist');

    //                     Favorite.insertMany(result)
    //                     res.json(result)
    //                 })
    //         })
})

// Get Watchlist
router.get('/', verify, (req, res) => {
    User.findById(req.user)
        .populate('watchlist')
        .exec((err, user) => {
            if (err) return res.json(err)
            res.json({
                name: user.name,
                email: user.email,
                watchlist: user.watchlist
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
                    { $pull: { watchlist: movie._id } },
                    { new: true, useFindAndModify: false }
                ).then(() => res.json("Movie deleted from watchlist"));
            }
        })
});


module.exports = router;