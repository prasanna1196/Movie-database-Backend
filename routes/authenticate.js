const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();


const {registerValidation, loginValidation} = require('../validation');

// Register user
router.post('/register', async (req, res) => {
    // Validate data
    const {error} = registerValidation(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    // Check if user already exists
    const emailExist = await User.findOne({email: req.body.email});

    if(emailExist) return res.status(400).send('Email already exist');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.status(200).send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }

});

// User login
router.post('/login', async (req, res) => {

    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check if user exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email not found');

    // Check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth', token).send(token);

    // res.status(200).send('Logged in successfully!');

})

module.exports = router;