module.exports.run = (client, message) => {
	const moment = require('moment');
	const Discord = require('discord.js');
	var colorsHex = client.colors;
	const guild = message.guild;
	let ServerDate = moment(guild.createdAt).format('MMMM Do YYYY, HH:mm');

	var embed = new Discord.RichEmbed()
		.setAuthor(guild.name, guild.iconURL)
		.addField('**Server Name**', guild.name, true)
		.addField('**Server Region**', guild.region, true)
		.addField('**Server Owner**', guild.owner, true)
		.addField('**Number of Channels**', guild.channels.array()
			.filter(channel => channel.type !== 'category').length)
		.addField('**Number of Members**', guild.memberCount)
		.addField('**Server Created At**', ServerDate)
		.setColor(colorsHex[Math.floor(Math.random() * colorsHex.length)])
		.setFooter('exectued by ' + message.author.username);
	message.channel.send(embed);
};

module.exports.help = {
	description: 'Displays Server Stats',
	usage: `${process.env.PREFIX}stats`
};