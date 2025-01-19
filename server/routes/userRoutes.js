import { Router } from 'express';
import { User } from '../models/User.js';

const router = Router();

// GET Route to fetch ALL users
router.get('/users', async (req, res) => {
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
router.get('/users/search', async (req, res) => {
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
router.post('/users/create', async (req, res) => {
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

export const userRouter = router;
