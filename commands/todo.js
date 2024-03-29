const Discord = require('discord.js');
const todolistSchema = require('../schemas/todolist-schema');
const mongo = require('../mongo.js');

module.exports = {
    name: 'todo',
    description: 'Lists all to-do list items, or adds to-do list items/marks items as complete',
    args: false,
    usage: '[one of add/complete/incomplete] <item to be added/removed from to-do list>',
    async execute(message, args) {
        const userId = message.author.id;
        todo_info = await mongo.getDB().collection("todolists").findOne({ userId });
        let incomplete = [];
        let complete = [];
        if (todo_info) {
            incomplete = todo_info.incompleteTasks;
            complete = todo_info.completeTasks;
        } else {
            await new todolistSchema({
                userId,
                complete,
                incomplete
            }).save();
        }

        if (args.length <= 1) {
            let todo_embed = new Discord.MessageEmbed().setColor('#0099ff');
            let embeds = [];
            let current_embed = 0;
            let counter = 5;
            if (!args[0]?.length || args[0] == "incomplete") {
                todo_embed.setTitle(`${message.author.username}'s To-Do List:`); 
                if (incomplete.length == 0) {
                    todo_embed.addField(
                        `No tasks found for ${message.author.username}`, "Use `~todo add <task>` to add tasks to your to-do list.", false
                    );
                    return message.channel.send(todo_embed);
                }
                for (let task of incomplete) {
                    if (counter === 0) {
                        embeds.push(todo_embed);
                        todo_embed = new Discord.MessageEmbed().setColor('#0099ff').setTitle(`${message.author.username}'s To-Do List:`);
                        counter = 5;
                    }
                    todo_embed.addFields(
                        { name: `${task}`, value: `Type \`~todo complete ${task}\` to mark this task as done.`, inline: false }
                    );
                    counter--;
                }
            } else if (args[0] == "complete") {
                todo_embed.setTitle(`${message.author.username}'s Complete Tasks:`); 
                if (complete.length == 0) {
                    todo_embed.addField(
                        `No complete tasks found for ${message.author.username}`, "Use `~todo complete <task>` to add tasks to your to-do list.", false
                    );
                    return message.channel.send(todo_embed);
                }
                for (let task of complete) {
                    if (counter == 0) {
                        embeds.push(todo_embed);
                        todo_embed = new Discord.MessageEmbed().setColor('#0099ff').setTitle(`${message.author.username}'s Complete Tasks:`);
                        counter = 5;
                    }
                    todo_embed.addFields(
                        { name: `${task}`, value: `Type \`~todo incomplete ${task}\` to mark this task as incomplete.`, inline: false }
                    );
                    counter--;
                }
            }
            embeds.push(todo_embed);
            const filter = (reaction, user) => {
                return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
            };

            message.channel.send(embeds[0]).then(msg => {
                if (embeds.length > 1) {
                    msg.react('➡️');
                }
                const collector = msg.createReactionCollector(filter, { time: 300000 });
                collector.on('collect', reaction => {
                    msg.reactions.removeAll().then(async () => {
                        if (reaction.emoji.name === '➡️') {
                            current_embed += 1;
                        } else {
                            current_embed -= 1;
                        }
                        if (current_embed <= 0) {
                            current_embed = 0;
                        } else if (current_embed >= embeds.length) {
                            current_embed -= 1;
                        }

                        msg.edit(embeds[current_embed]);
                       if (current_embed !== 0) {
                            await msg.react('⬅️');
                        }
                        if (current_embed < embeds.length - 1) {
                            await msg.react('➡️');
                        }
                    });
                })
                collector.on('end', () => {
                    msg.reactions.removeAll();
                });
            });
            return;
        }
        const command_name = args[0].split(/\s/)[0].toLowerCase();

        if (command_name != "add" && command_name != "complete" && command_name != "incomplete") {
            return message.channel.send(`Error: no command with the name ${command_name} was found.`);

        } else if (command_name == "add") {
            let new_task = args.slice(1, args.length).join(" ");
            incomplete.push(new_task);
            await mongo.getDB().collection("todolists").findOneAndUpdate({ "userId": userId }, { $set: { incompleteTasks: incomplete, completeTasks: complete } });
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
                await mongo.getDB().collection("todolists").findOneAndUpdate({ userId: userId }, { $set: { incompleteTasks: incomplete, completeTasks: complete } });
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
                await mongo.getDB().collection("todolists").findOneAndUpdate({ userId: userId }, { $set: { incompleteTasks: incomplete, completeTasks: complete } });
                return message.channel.send(`Task \`${incompleteTask}\` successfully marked as incomplete!`)
            }
            return message.channel.send(`No task called ${taskToIncomplete} was found.`);
        }
        return;
    },
};

