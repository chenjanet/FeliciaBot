const mongoose = require('mongoose');
require('dotenv').config();

module.exports = async () => {
    await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    return mongoose
}