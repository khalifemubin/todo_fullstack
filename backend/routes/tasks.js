const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/Task');

/**
* Create a task
* title (required)
* description (required)
* expiryDate (required)
*/
router.post(
    '/',
    authMiddleware,
    [
        //title, description and expiryDate fields are required
        check('title', 'Title is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('expiryDate', 'Expiry Date is required').not().isEmpty(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            //If there are errors, send error object in response
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Extract fields from the request body
            const { title, description, tags, expiryDate } = req.body;

            const newTask = new Task({
                title,
                description,
                tags,
                user: req.user.id,
                expiryDate
            });

            //save data in tasks collection
            const task = await newTask.save();

            //and return updated document
            res.json(task);
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
);

/**
* Get all tasks for a user
*/
router.get('/', authMiddleware, async (req, res) => {
    try {
        //find tasks by user id
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

/**
* Get specific task for a user
*/
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        //get specific task information
        const tasks = await Task.find({ user: req.user.id, _id: req.params.id });
        res.json(tasks);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

/**
* Update a task
*/
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        //if document not found in tasks collection, return with error
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // If the user does not own the task, return with error
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not Authorized' });
        }

        //update fields sent by request and return updated task document
        task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        res.json(task);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

/**
* Delete a task
*/
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // If the user does not own the task, return with error
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Task.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Task removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

/**
* Routes for Tasks
*/
module.exports = router;
