if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');


const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/lms';
mongoose.set("strictQuery", false);
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running onn Port ${PORT}`));