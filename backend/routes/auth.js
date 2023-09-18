const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

/**
* Register a new user
*/
router.post(
    '/register',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            //If there are any validation errors then return with error object
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //extract email and password from request body
            const { email, password } = req.body;

            let user = await User.findOne({ email });

            //If user already exists then notify the user of the same
            if (user) {
                return res.status(400).json({ msg: 'Email already exists. Please register with new email' });
            }

            user = new User({
                email,
                password,
            });

            await user.save();

            //create payload containing user id
            const payload = {
                user: {
                    id: user.id,
                },
            };

            //After saving user, send the jwt to client and make the user sign in
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: 3600, // 1 hour
                },
                (err, token) => {
                    if (err) throw err;

                    res.json({ user: user, token });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
);

/**
* Login user
*/
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            //match password using the method defined in Schema
            const isMatch = await user.comparePassword(password);

            //If password don't match, notify user
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            //Everything is ok, proceed to make user sign in to app
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: 3600, // 1 hour
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ user: user, token });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
);

/**
* Get authenticated user
*/
router.get('/user', authMiddleware, async (req, res) => {
    try {
        //send user data without password in response
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

/**
* Routes for Authentication and Authorization
* /register (POST)
* /login (POST)
* /user (GET)
*/
module.exports = router;
