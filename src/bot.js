const fs = require('fs');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config({
	path: '../.env'
});
const path = require('path');
const slash = require('slash');
const watcher = require('./util/watcher');

const Discord = require('discord.js');
const client = new Discord.Client();

const categories = fs.readdirSync('./commands');

client.commands = new Discord.Collection();
client.directories = new Discord.Collection();
client.categories = new Discord.Collection();
client.colors = ['#A15CFD', '#FD5C68', '#FD5CB8', '#FDA15C', '#FDF15C', '#78F35A', '#5A78F3'];

const categoriesDirectories = categories.map(categoryName =>
	slash(path.join('./commands', categoryName))
);

categoriesDirectories.forEach(category => {
	let commands = fs.readdirSync(category);

	let commandsName = commands.map(command => command.split('.')[0]);
	let categoryName = category.split('/')[1];
	client.categories.set(categoryName, commandsName);

	commands.forEach(command => {
		if (!command.endsWith('.js')) return;
		let commandName = command.split('.')[0];
		let commandPath = slash(path.join(category, commandName));
		const commandProp = require('./' + commandPath);
		client.commands.set(commandName, commandProp);
		client.directories.set(commandName, commandPath);
	});
});

const events = fs.readdirSync('./events');

events.forEach(event => {
	if (!event.endsWith('.js')) return;
	let eventName = event.split('.')[0];
	let eventPath = slash(path.join('./events', eventName));
	const eventProp = require('./' + eventPath);
	client.on(eventName, (...args) => eventProp.run(client, ...args));
});

watcher.init(client, process.env.NODE_ENV);

client.login(process.env.DISCORD_TOKEN);