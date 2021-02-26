const mongoose = require('mongoose');
require('dotenv').config();

let _db;

async function connectDB() {
    await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    _db = mongoose.connections[0].db;
    return mongoose;
}

function getDB() {
    return _db;
}

module.exports = { connectDB, getDB };