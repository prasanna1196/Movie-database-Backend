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
            if(results.length < 1) return res.send('Nothing here');
    
                // results.map(result => {
                //    res.json( {
                //        name: result.name,
                //        year: result.year,
                //        director: result.director,
                //        starCast: result.starCast
                //    })
                                  
               res.status(200).json({ movies: results,
                user: req.user});
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
    Movie.findOne({name: req.params.name})
    .then(doc => {
    if(!doc) {        
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
    then(doc => {
    if(!doc) {        
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
        almost : {
            name: req.body.name,
            year: req.body.year,
            director: req.body.director,
            starCast: req.body.starCast
        }
    })

Object.keys(upMovie.almost).forEach((key) => (upMovie.almost[key] == null) && delete upMovie.almost[key])
    // for(let key in upMovie) {
        
    //     if(upMovie[key] === null || upMovie[key] === undefined) {
    //         delete upMovie[key]
    //     } else {
    //         console.log('All good');
    //     }
    // }


    //upMovie.save()
    // UpdateMovie.findOne({name: name})
    // .then(stfu => {
        Movie.findOne({name: name})
        .then((data) => {
            if(!data) return res.status(404).json('Movie does not exist');
            // const upMovie = new UpdateMovie ({
            //     name: req.body.name,
            //     year: req.body.year,
            //     director: req.body.director,
            //     starCast: req.body.starCast
            // })
            //console.log(data);
            //res.json(upMovie);
    
            // const asdf = {
            //     //_id: 12345678,
            //     year: 2345,
            //     director: "dnafghni"
            // }
    
            Movie.updateOne({name: name}, 
                { $set : upMovie.almost
            })
                .then(result => {
                    console.log(upMovie.almost);
                    res.json(upMovie.almost)
                })
        })

})


module.exports = router;