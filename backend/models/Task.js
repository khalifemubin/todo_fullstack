const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    tags: [String],
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiryDate: Date
});

/** 
* Schema for tasks collection
* @title (String) 
* @description (String)
* @tags Array [String]
* @user objectid from users collection
*/
module.exports = mongoose.model('Task', taskSchema);
