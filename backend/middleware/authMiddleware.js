const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/**
 * A middleware to check for authorization
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns
 */
module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // If token not present, return with 401 status and a message
    if (!token) {
        return res.status(401).json({ msg: 'Not Authorized' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //obtain user data
        req.user = decoded.user;
        //proceed
        next();
    } catch (err) {
        // If token invalid, return with 401 status and a message
        res.status(401).json({ msg: 'Token is invalid' });
    }
};
