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
                            if (!result) return res.send('Movie does not exist');
                            const fav = {favorite: result}

                            
                            User.findByIdAndUpdate({_id: req.user._id},
                                { $push :{favorites : result} },
                                {useFindAndModify: false})
                                .then(blah => res.json(blah))
            //                 res.json(result)
            //             })
                })
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
router.get('/', (req, res) => {
    Favorite.find()
        .then(results => {
            if (results.length < 1) return res.send('Nothing here');

            res.status(200).json(results);

        })
        .catch(err => {
            res.send(err);
        })

});

// Delete a movie
router.delete('/:name', (req, res) => {
    Favorite.findOne({ name: req.params.name }).
        then(doc => {
            if (!doc) {
                return res.status(400).send('Movie not found');
            } else {
                Favorite.deleteOne({ name: req.params.name })
                    .then(() => res.status(200).json('Deleted'))
                    .catch(err => res.status(400).json(err))
            }
        })
});

module.exports = router;