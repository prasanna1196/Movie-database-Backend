const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/movies');
const app = express();




// Connect to DB
mongoose.connect(
    "mongodb://localhost:27017/movies",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));


// Json middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Import Routes
const moviesRoute = require('./routes/movies');

// Routes
app.use('/movies', moviesRoute);







// Start server
app.listen(3000, () => {
    console.log('Listening on port 3000');
});




