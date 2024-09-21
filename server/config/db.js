const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('MongoDB URI not set in environment variables');
        process.exit(1);
    }

    try {
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (error) {
        console.error(`Error Connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
