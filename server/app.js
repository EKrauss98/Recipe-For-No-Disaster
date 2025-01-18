import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'vite';
import { User } from './User.js';

import dotenv from 'dotenv';
dotenv.config();

// Connection String to DB
const DB_CONNECTION_STRING = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_PATH}/?retryWrites=true&w=majority&appName=RFND-EUW-01`;
const PORT = process.env.PORT || 8080;

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Route handlers
// GET Route to fetch ALL users
app.get('/users', async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find(); 
        
        // Respond with a JSON array of all users
        res.status(200).json(users);
    } catch (err) {
        console.error(err);

        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET Route to fetch specific user
app.get('/users/search', async (req, res) => {
    const { name } = req.body; // Get 'user' from query string (e.g., /find-user?user=John Doe)

    if (!name) {
        return res.status(400).json({ message: "User query parameter is required" });
    }

    try {
        const foundUser = await User.findOne({ name }); // Find a user by the 'user' field

        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(foundUser); // Respond with the found user
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST Route to create a new user
app.post('/users/create', async (req, res) => {
    const { name, age } = req.body;

    if (!name || !age) {
        return res.status(400).json({ message: "Both 'user' and 'age' are required" });
    }

    try {
        const newUser = new User({ name, age });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Attempt to create a connection to MongoDB
mongoose.connect(DB_CONNECTION_STRING)
    .then(() => {
        console.log('Connected to MongoDB...');
    }).catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });

async function startServer() {
    const vite = await createServer({
        server: { middlewareMode: true },
    });

    // Use Vite's middleware to handle requests
    app.use(vite.middlewares);

    app.listen(PORT, () => {
        console.log(`Server is listening on http://localhost:${PORT}...`);
    });
}

startServer();