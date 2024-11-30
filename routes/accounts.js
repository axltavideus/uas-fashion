const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Get all accounts
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude passwords
        res.send(users);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch accounts' });
    }
});

// Edit an account
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send({ error: 'Account not found' });
        }
        res.send(updatedUser);
    } catch (err) {
        res.status(400).send({ error: 'Failed to update account', details: err.message });
    }
});

// Delete an account
router.delete('/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send({ error: 'Account not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(400).send({ error: 'Failed to delete account', details: err.message });
    }
});

module.exports = router;
