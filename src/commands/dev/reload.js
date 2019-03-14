module.exports.run = (client, message, args) => {

	if (message.author.id !== process.env.BOT_OWNER_ID) return;

	if (!args[0]) {
		client.directories.tap((commandPath, commandName) => {
			delete require.cache[require.resolve(`../../${commandPath}`)];
			client.commands.delete(commandName);
			const props = require(`../../${commandPath}`);
			client.commands.set(commandName, props);
			message.reply(`The command ${commandName} has been reloaded`);
		});
	} else if (!client.commands.has(args[0])) {
		return message.channel.send('I cannot find that command');

	} else {

		let commandName = args[0];


		let commandPath = client.directories.get(commandName);
		delete require.cache[require.resolve(`../../${commandPath}`)];

		client.commands.delete(commandName);
		const commandProps = require(`../../${commandPath}`);

		client.commands.set(commandName, commandProps);

		message.channel.send(`The command ${commandName} has been reloaded`);

	}

};

module.exports.help = {
	description: 'Reloads commands',
	usage: '!reload command'
};