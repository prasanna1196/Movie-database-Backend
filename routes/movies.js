const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Movie = require('../model/Movie');

// Get all movies
router.get('/', (req, res) => {
    Movie.find()
        .exec()
        .then(results => {
            if(results.length < 1) return res.send('Nothing here');
    
                // results.map(result => {
                //    res.json( {
                //        name: result.name,
                //        year: result.year,
                //        director: result.director,
                //        starCast: result.starCast
                //    })
                                  
               res.status(200).json(results);
               //})
           
        })
        .catch(err => {
            res.send(err);
        })
    
});

// Add a movie
router.post('/', (req, res) => {

    Movie.findOne({ name : req.body.name})
        .then( doc => {
        if(doc) return res.send('Movie Already Exists');
        
        const movie = new Movie({
            name: req.body.name,
            year: req.body.year,
            director: req.body.director,
            starCast: req.body.starCast
        });
        movie.save()
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
    Movie.findOne({name: req.params.name}).
    then(doc => {
    if(!doc) {        
        return res.status(400).send('Email not found');
    } else {
        Movie.findOne({name: req.params.name})
            .then(result => res.status(200).json(result))
            .catch(err => res.status(400).json(err))
    }
    })
})

// Delete a movie



module.exports = router;