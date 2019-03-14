module.exports.run = (client, message, args) => {

	const Discord = require('discord.js');

	if (!args[0]) {
		return message.channel.send('Please specify a command!');
	}

	let command = args[0];
	let commandInfo = client.commands.get(command);

	if (!commandInfo) {
		return message.channel.send(`I don't have a **${command}** command`);
	}

	let member = message.author;
	let helpEmbed = new Discord.RichEmbed()
		.setAuthor(member.tag, member.displayAvatarURL)
		.addField(`**➤ ${process.env.PREFIX}${command}**`, 'Information about the command')
		.addField('**➤ __Command Information__**', '\n**Description: **' + commandInfo.help.description + '\n**Usage: **' + commandInfo.help.usage)
		.setFooter('exectued by ' + message.author.username)
		.setColor('#FF66C0');
	message.channel.send(helpEmbed);

};

module.exports.help = {
	description: 'Boilerplate command',
	usage: '{prefix}command'
};