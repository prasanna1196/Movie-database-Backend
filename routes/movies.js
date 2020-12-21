const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Movie = require('../model/Movie');
const UpdateMovie = require('../model/UpdateMovie');
const verify = require('./verifyToken');

// Get all movies
router.get('/', verify, (req, res) => {
    Movie.find()
        .exec()
        .then(results => {
            if (results.length < 1) return res.send('Nothing here');

            res.status(200).json({
                movies: results,
                user: req.user
            });

        })
        .catch(err => {
            res.send(err);
        })
});

// Add a movie
router.post('/', verify, (req, res) => {

    Movie.findOne({ name: req.body.name })
        .then(movie => {
            if (movie) return res.send('Movie Already Exists');

            const addMovie = new Movie({
                name: req.body.name,
                year: req.body.year,
                director: req.body.director,
                starCast: req.body.starCast
            });
            addMovie.save()
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(err => {
                    res.status(400).send(err);
                });

        })
        .catch(err => res.send(err));

})


// Get movie by name
router.get('/:name', verify, (req, res) => {
    Movie.findOne({ name: req.params.name })
        .then(movie => {
            if (!movie) {
                return res.status(400).send('Movie not found');
            } else {
                Movie.findOne({ name: req.params.name })
                    .then(result => res.status(200).json(result))
                    .catch(err => res.status(400).json(err))
            }
        })
})


// Delete a movie
router.delete('/:name', verify, (req, res) => {
    Movie.findOne({ name: req.params.name }).
        then(movie => {
            if (!movie) {
                return res.status(400).send('Movie not found');
            } else {
                Movie.deleteOne({ name: req.params.name })
                    .then(() => res.status(200).json('Deleted'))
                    .catch(err => res.status(400).json(err))
            }
        })
});


// Update a movie
router.patch('/:name', verify, (req, res) => {
    const name = req.params.name;
    const upMovie = new UpdateMovie({
        edits: {
            name: req.body.name,
            year: req.body.year,
            director: req.body.director,
            starCast: req.body.starCast
        }
    })

    Object.keys(addMovie).forEach((key) => (addMovie[key] == null) && delete addMovie[key])

    Movie.findOne({ name: name })
        .then((movie) => {
            if (!movie) return res.status(404).json('Movie does not exist');

            Movie.updateOne({ name: name },
                {
                    $set: addMovie
                })
                .then(result => {
                    console.log(addMovie);
                    res.json(addMovie)
                })
        })

})

// Sorted list
router.post('/sort', verify, (req, res) => {
    const sort = { sortBy: req.body.sortBy }

    if (sort.sortBy == "year") {
        Movie.find().sort({ year: 1 })
            .then(sortedList => res.json(sortedList))
    }
    else if (sort.sortBy == "name") {
        Movie.find().sort({ name: 1 })
            .then(sortedList => res.json(sortedList))
    }
    else if (sort.sortBy == "date") {
        Movie.find().sort({ date: -1 })
            .then(sortedList => res.json(sortedList))
    }
    else {
        res.send(`Cannot sort by ${sort.sortBy}`)
    }

})


module.exports = router;