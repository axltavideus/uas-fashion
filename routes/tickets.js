const express = require('express');
const Tickets = require('../models/tickets');
const router = express.Router();

// Create a new event
router.post('/', async (req, res) => {
    const { name, location, time, description } = req.body;

    if (!name || !location || !time || !description) {
        return res.status(400).send({ error: 'All fields except email are required' });
    }

    try {
        const ticket = new Tickets(req.body);
        const savedTicket = await ticket.save();
        res.status(201).send(savedTicket);
    } catch (err) {
        res.status(400).send({ error: 'Failed to create event', details: err.message });
    }
});
// Get all events
router.get('/', async (req, res) => {
    try {
        const tickets = await Tickets.find();
        res.send(tickets);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch events' });
    }
});

// Edit an event
router.put('/:id', async (req, res) => {
    try {
        const updatedTicket = await Tickets.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTicket) {
            return res.status(404).send({ error: 'Event not found' });
        }
        res.send(updatedTicket);
    } catch (err) {
        res.status(400).send({ error: 'Failed to update event', details: err.message });
    }
});

// Delete an event
router.delete('/:id', async (req, res) => {
    try {
        const result = await Tickets.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send({ error: 'Event not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(400).send({ error: 'Failed to delete event', details: err.message });
    }
});

// Sign up for an event
router.post('/:id/signup', async (req, res) => {
    try {
        const { email } = req.body;
        const ticket = await Tickets.findById(req.params.id);

        if (!ticket) {
            return res.status(404).send({ error: 'Event not found' });
        }

        if (ticket.users.includes(email)) {
            return res.status(400).send({ error: 'User already signed up for this event' });
        }

        ticket.users.push(email);
        await ticket.save();

        res.status(200).send({ message: 'Successfully signed up for the event' });
    } catch (err) {
        res.status(400).send({ error: 'Failed to sign up for the event', details: err.message });
    }
});

module.exports = router;
