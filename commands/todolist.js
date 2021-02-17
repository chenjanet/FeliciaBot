const mongo = require('../mongo.js');
const todolistSchema = require('../schemas/todolist-schema');

module.exports.getTodolist = async (userId) => {
    return await mongo().then(async mongoose => {
        try {
            const result = await todolistSchema.findOne({ userId });
            let incomplete = [];
            let complete = [];
            let lastTaskId = -1;
            if (result) {
                incomplete = result.incompleteTasks;
                complete = result.completeTasks;
                lastTaskId = result.lastTaskId;
            } else {
                await new todolistSchema({
                    userId,
                    complete,
                    incomplete
                }).save();
            }
            return {
                "completeList": complete,
                "incompleteList": incomplete,
                "lastId": lastTaskId
            };
        } finally {
            mongoose.connection.close();
        }
    })
}

module.exports.updateTodolist = async (userId, incompleteList, completeList) => {
    return await mongo().then(async mongoose => {
        try {
            const result = await todolistSchema.findOneAndUpdate(
                { 
                    userId: userId 
                },
                {
                    incompleteTasks: incompleteList,
                    completeTasks: completeList
                }
            );
        } finally {
            mongoose.connection.close();
        }
    });
}