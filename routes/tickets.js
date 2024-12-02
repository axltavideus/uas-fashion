const express = require('express');
const multer = require('multer');
const Tickets = require('../models/tickets'); // Assuming you have a Tickets model

const router = express.Router();

const upload = multer({
    dest: './uploads/', // Directory for uploads
    limits: { fileSize: 1000000 }, // 1MB file size limit
});

// Add a ticket (event)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const ticket = new Tickets({
            name: req.body.name,
            location: req.body.location,
            time: req.body.time,
            description: req.body.description,
            image: req.file ? `/uploads/${req.file.filename}` : null, // Save accessible path
        });
        await ticket.save();
        res.status(201).send(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Unable to add event' });
    }
});

// Update a ticket (event)
router.put('/:id', upload.single('image'), async (req, res) => {
    const ticketId = req.params.id;
    const updatedData = {
        name: req.body.name,
        location: req.body.location,
        time: req.body.time,
        description: req.body.description,
        image: req.file ? `/uploads/${req.file.filename}` : undefined, // Update image if a new one is uploaded
    };

    try {
        const updatedTicket = await Tickets.findByIdAndUpdate(ticketId, updatedData, { new: true });
        if (!updatedTicket) {
            return res.status(404).send('Ticket not found');
        }
        res.send(updatedTicket);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Unable to update event' });
    }
});

// Get all tickets (events)
router.get('/', async (req, res) => {
    try {
        const tickets = await Tickets.find();
        res.send(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Unable to fetch events' });
    }
});

// Sign up for an event
router.post('/:id/signup', async (req, res) => {
    const ticketId = req.params.id;
    const userEmail = req.body.email;

    console.log('Received signup request for ticket ID:', ticketId, 'with email:', userEmail);

    try {
        const ticket = await Tickets.findById(ticketId);
        if (!ticket) {
            console.error('Event not found for ID:', ticketId);
            return res.status(404).send({ error: 'Event not found' });
        }

        // Check if the user is already signed up
        if (ticket.users.includes(userEmail)) {
            console.warn('User  already signed up:', userEmail);
            return res.status(400).send({ error: 'You are already signed up for this event.' });
        }

        // Add the user email to the ticket's users array
        ticket.users.push(userEmail);
        await ticket.save();

        console.log('Successfully signed up user:', userEmail);
        res.status(200).send({ message: 'Successfully signed up for the event' });
    } catch (error) {
        console.error('Error signing up for event:', error);
        res.status(500).send({ error: 'Failed to sign up for the event' });
    }
});

module.exports = router;