const slash = require('slash');
const fs = require('fs');

module.exports = (client, path, pathSplit) => {

	const initFile = fs.readFileSync('./util/boilerplate/command.js');

	let command = pathSplit[2];

	if (!command.endsWith('.js')) return;


	fs.writeFile(`./${path}`, initFile, () => {

		let commandPath = slash(path.split('.')[0]);
		let commandName = command.split('.')[0];

		let category = pathSplit[1];
		let categoryCommands = client.categories.get(category);

		categoryCommands.push(commandName);

		const props = require(`../${commandPath}`);

		client.commands.set(commandName, props);
		client.directories.set(commandName, commandPath);
		client.categories.set(category, categoryCommands);
	});
};