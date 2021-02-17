const Discord = require('discord.js');
const todolist = require('./todolist.js')

module.exports = {
    name: 'todo',
    description: 'Lists all to-do list items, or adds to-do list items/marks items as complete',
    args: false,
    displayHelp: true,
    usage: '[one of add/complete/incomplete] <item to be added/removed from to-do list>',
    async execute(message, args) {
        const userId = message.author.id;
        const todo_embed = new Discord.MessageEmbed().setColor('#0099ff');
        const todo_info = await todolist.getTodolist(userId);
        let incomplete = todo_info.incompleteList;
        let complete = todo_info.completeList;

        if (!args[0]?.length || (args[0] == "incomplete" && args.length == 1)) {
            todo_embed.setTitle(`${message.author.username}'s To-Do List:`); 
            if (incomplete.length == 0) {
                todo_embed.addField(
                    `No tasks found for ${message.author.username}`, "Use `~todo add <task>` to add tasks to your to-do list.", false
                );
                return message.channel.send(todo_embed);
            }
            for (let task of incomplete) {
                todo_embed.addFields(
                    { name: `${task}`, value: `Type \`~todo complete ${task}\` to mark this task as done.`, inline: false }
                );
            }
            return message.channel.send(todo_embed);

        } else if (args[0] == "complete" && args.length == 1) {
            todo_embed.setTitle(`${message.author.username}'s Complete Tasks:`); 
            if (complete.length == 0) {
                todo_embed.addField(
                    `No complete tasks found for ${message.author.username}`, "Use `~todo complete <task id>` to add tasks to your to-do list.", false
                );
                return message.channel.send(todo_embed);
            }
            for (let task of complete) {
                todo_embed.addFields(
                    { name: `${task}`, value: `Type \`~todo incomplete ${task}\` to mark this task as incomplete.`, inline: false }
                );
            }
            return message.channel.send(todo_embed);
        }

        const command_name = args[0].split(/\s/)[0].toLowerCase();

        if (command_name != "add" && command_name != "complete" && command_name != "incomplete") {
            return message.channel.send(`Error: no command with the name ${command_name} was found.`);

        } else if (command_name == "add") {
            let new_task = args.slice(1, args.length).join(" ");
            incomplete.push(new_task);
            await todolist.updateTodolist(userId, incomplete, complete);
            return message.channel.send(`Task ${new_task} successfully added! Type \`~todo\` to view all current tasks.`);

        } else if (command_name == "complete") {
            let taskToDelete = args.slice(1, args.length).join(" ");
            let deletedTask;
            for (let task of incomplete) {
                if (task == taskToDelete) {
                    deletedTask = incomplete.splice(0, 1)[0];
                    break; 
                }
            }
            if (typeof deletedTask != "undefined") {
                complete.push(deletedTask);
                await todolist.updateTodolist(userId, incomplete, complete);
                return message.channel.send(`Task \`${deletedTask}\` successfully marked as completed!`);
            }
            return message.channel.send(`No task called ${taskToDelete} was found.`);
            
        } else if (command_name == "incomplete") {
            let taskToIncomplete = args.slice(1, args.length).join(" ");
            let incompleteTask;
            for (let task of complete) {
                if (task == taskToIncomplete) {
                    incompleteTask = complete.splice(0, 1)[0];
                    break; 
                }
            }
            if (typeof incompleteTask != "undefined") {
                incomplete.push(incompleteTask);
                await todolist.updateTodolist(userId, incomplete, complete);
                return message.channel.send(`Task \`${incompleteTask}\` successfully marked as incomplete!`)
            }
            return message.channel.send(`No task called ${taskToIncomplete} was found.`);
        }
        return;
    },
};

