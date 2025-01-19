import mongoose from "mongoose";

// TODO For some reason we can't import models into app.js
const userSchema = new mongoose.Schema({
    name: { type: String },
    age: { type: Number },
});

export const User = mongoose.model('User', userSchema);
