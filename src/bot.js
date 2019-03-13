// Imports necessary modules
const fs = require("fs");
const dotenv = require("dotenv").config({
	path: "../.env"
});
const path = require("path");
const slash = require("slash");

// Inits Discord client aka bot lol
const Discord = require("discord.js");
const client = new Discord.Client();

// Returns array of category folders
const categories = fs.readdirSync("./commands");

// Initiates Discord collections see https://discord.js.org/#/docs/main/stable/class/Collection
client.commands = new Discord.Collection();
client.directories = new Discord.Collection();
client.categories = new Discord.Collection();

// Returns an array of paths to categories eg: ./commands/fun instead of commands\fun\etc because of how shitty windows is.
categoriesDirectories = categories.map(categoryName =>
	slash(path.join("./commands", categoryName))
);


categoriesDirectories.forEach(category => {
	let commands = fs.readdirSync(category);
	
	// sets the value of the client.categories collection because we're gonna need it later
	let commandsName = commands.map((command) => command.split(".")[0]);
	let categoryName = category.split("/")[1]
	client.categories.set(categoryName, commandsName);

	// The classic require js file in each dir and set its props in the client.commands collection
	commands.forEach((command) => {
		if (!command.endsWith(".js")) return;
		let commandName = command.split(".")[0];
		let commandPath = slash(path.join(category, commandName));
		const commandProp = require("./" + commandPath);
		client.commands.set(commandName, commandProp)
		client.directories.set(commandName, commandPath);
	})
});

const events = fs.readdirSync("./events");

// Event handler
events.forEach((event) => {
	if (!event.endsWith(".js")) return;
	let eventName = event.split(".")[0];
	let eventPath = slash(path.join("./events", eventName));
	const eventProp = require("./" + eventPath);
	client.on(eventName, (...args) => eventProp.run(client, ...args));
})


// Do i really need to commet on this ?
client.login(process.env.DISCORD_TOKEN);
