// db.js

import mongoose from 'mongoose';

const dbUrl = "mongodb+srv://satishchawali:724893@cluster0.dqjxjvx.mongodb.net/food_del_local";

export const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
    }
}