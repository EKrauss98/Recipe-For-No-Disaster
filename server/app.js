import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'vite';
import { userRouter } from './routes/userRoutes.js';

import dotenv from 'dotenv';
dotenv.config();

// Connection String to DB
const DB_CONNECTION_STRING = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_PATH}/?retryWrites=true&w=majority&appName=RFND-EUW-01`;
const PORT = process.env.PORT || 8080;

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Route handlers ------------- //
app.use('/api/user', userRouter);
// Route handlers ------------- //

// Attempt to create a connection to MongoDB
mongoose.connect(DB_CONNECTION_STRING, { dbName: 'RFND' })
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