module.exports.run = (client, message) => {
	const prefix = process.env.PREFIX;


	if (message.author.bot) return;
	if (message.content.indexOf(prefix) !== 0) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName);


	if (!command) {
		return message.channel.send(`Unknown command, please do ${prefix} help`);
	};

	command.run(client, message, args);
}