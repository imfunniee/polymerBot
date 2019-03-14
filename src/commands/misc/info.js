module.exports.run = (client, message) => {
	const moment = require('moment');
	const Discord = require('discord.js');

	let member = message.mentions.members.first();
	if (!member) {
		return message.channel.send('Please mention a member');
	}
	let roles = member.roles.filter((role) => role.name !== '@everyone').map((role) => role.name).join(', ') || 'No roles';
	let joinDate = moment(member.joinedAt).format('MMMM Do YYYY, HH:mm    ');
	let createDate = moment(member.user.createdAt).format('MMMM Do YYYY, HH:mm    ');

	let memEmbed = new Discord.RichEmbed()
		.setAuthor(member.user.tag, member.user.displayAvatarURL)
		.addField('**➤ __User information__**', '\n**ID: **' + member.user.id + '\n**Nickname: **' + member.displayName + '\n**Created: **' + createDate, false)
		.addField('**➤ __Member information__**', '\n**Joined: **' + joinDate + '\n**Roles: **' + roles + '\n**Highest role: **' + member.highestRole, false)
		.addField('**➤ __Activity__**', '\n**Last message: **' + '`' + member.lastMessage + '`' + '\n**Last message ID: **' + member.lastMessageID, true)
		.setFooter('exectued by ' + message.author.username)
		.setColor('#FF66C0')
		.setThumbnail(member.user.displayAvatarURL);
	message.channel.send(memEmbed);
};

module.exports.help = {
	description: 'Displays userinfo',
	usage: `${process.env.PREFIX}info < @mention >`
};