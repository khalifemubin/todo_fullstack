const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
* Schema For users collection
*/
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

/**
* before registering new user, encrypt the password
*/
userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
* compare password method
*/
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

/** 
* Schema for users collection
* @email (String) 
* @password (String)
*/
module.exports = mongoose.model('User', userSchema);
