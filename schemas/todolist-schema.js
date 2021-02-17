const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const todolistSchema = mongoose.Schema({
    userId: reqString,
    completeTasks: {
        type: Array,
        required: true,
    },
    incompleteTasks: {
        type: Array,
        required: true,
    }
});

module.exports = mongoose.model('todolist', todolistSchema);