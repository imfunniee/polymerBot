module.exports.run = (client, message, args) => {
	const moment = require("moment");
	var colorsHex = ["#A15CFD","#FD5C68","#FD5CB8","#FDA15C","#FDF15C","#78F35A","#5A78F3"];
	const Discord = require("discord.js");

	let member = message.mentions.members.first();
	if(!member) return;
	let roles = member.roles.filter((role) => role.name !== "@everyone").map((role) => role.name).join(", ") || "No roles";
	let joinDate = moment(member.joinedAt).format("MMMM Do YYYY, HH:mm");
	let createDate = moment(member.user.createdAt).format("MMMM Do YYYY, HH:mm");

	let memEmbed = new Discord.RichEmbed()
		.setAuthor(member.user.tag, member.user.displayAvatarURL)
		.addField("**User information**", "\n**ID: **" + member.user.id + "\n**Nickname: **" + member.displayName + "\n**Created: **" + createDate, false)
		.addField("**Member information**", "\n**Joined: **" + joinDate + "\n**Roles: **" + roles + "\n**Highest role: **" + member.highestRole, false)
		.addField("**Activity**", "\n**Last message: **" + "`" + member.lastMessage + "`" + "\n**Last message ID: **" + member.lastMessageID, true)
		.setFooter("exectued by " + message.author.username)
        .setColor(colorsHex[Math.floor(Math.random() * colorsHex.length)])
		.setThumbnail(member.user.displayAvatarURL);
	message.channel.send(memEmbed);
}

module.exports.help = {
	description: "Displays User's Info",
	usage: `${process.env.PREFIX}info <@mention>`
}