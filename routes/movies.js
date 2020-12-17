const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Movie = require('../model/Movie');
const UpdateMovie = require('../model/UpdateMovie');
const verify = require('./verifyToken');

// Get all movies
router.get('/', (req, res) => {
    Movie.find()
        .exec()
        .then(results => {
            if(results.length < 1) return res.send('Nothing here');
                                  
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
router.post('/', (req, res) => {

    Movie.findOne({ name : req.body.name})
        .then( movie => {
        if(movie) return res.send('Movie Already Exists');
        
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
router.get('/:name', (req, res) => {
    Movie.findOne({name: req.params.name})
    .then(movie => {
    if(!movie) {        
        return res.status(400).send('Movie not found');
    } else {
        Movie.findOne({name: req.params.name})
            .then(result => res.status(200).json(result))
            .catch(err => res.status(400).json(err))
    }
    })
})


// Delete a movie
router.delete('/:name', (req, res) => {
    Movie.findOne({name: req.params.name}).
    then(movie => {
    if(!movie) {        
        return res.status(400).send('Movie not found');
    } else {
        Movie.deleteOne({name: req.params.name})
            .then(() => res.status(200).json('Deleted'))
            .catch(err => res.status(400).json(err))
    }
    })
});


// Update a movie
router.patch('/:name', (req, res) => {
    const name = req.params.name;
    const upMovie = new UpdateMovie ({
        edits : {
            name: req.body.name,
            year: req.body.year,
            director: req.body.director,
            starCast: req.body.starCast
        }
    })

Object.keys(upMovie.edits).forEach((key) => (upMovie.edits[key] == null) && delete upMovie.edits[key])

        Movie.findOne({name: name})
        .then((movie) => {
            if(!movie) return res.status(404).json('Movie does not exist');
    
            Movie.updateOne({name: name}, 
                { $set : upMovie.edits
            })
                .then(result => {
                    console.log(upMovie.edits);
                    res.json(upMovie.edits)
                })
        })

})


module.exports = router;