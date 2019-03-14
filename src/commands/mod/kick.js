module.exports.run = (client, message) => {
    var colorsHex = ['#A15CFD', '#FD5C68', '#FD5CB8', '#FDA15C', '#FDF15C', '#78F35A', '#5A78F3'];
    const Discord = require('discord.js');

    function displayMessage(text, user) {
        var embed = new Discord.RichEmbed()
            .setTitle(text)
            .setColor(colorsHex[Math.floor(Math.random() * colorsHex.length)])
            .setFooter('exectued by ' + user);
        message.channel.send(embed);
        return embed;
    }

    let member = message.mentions.members.first();
    if (member) {
        if (!message.member.roles.find(roleFind => roleFind.name === 'moderator') || !message.member.roles.find(roleFind => roleFind.name === 'server-manager')) {
            displayMessage('You need a Moderator or above Roles to use this command', message.author.username);
            return;
        }
        const kickMember = message.guild.member(member);
        var kickText = message.content.substring(process.env.PREFIX.length).slice('5');
        kickText = kickText.split(' ');
        if (!kickText[1]) {
            kickText = 'they were bad :p';
        } else {
            kickText = kickText[1];
        }
        if (member) {
            kickMember.kick({
                reason: kickText,
            }).then(() => {
                message.reply(`Successfully Kicked ${kickMember.tag}`, message.author.username);
            }).catch(err => {
                console.error(err);
                displayMessage('Unable to Kick the Member', message.author.username);
            });
        } else {
            displayMessage('The user isn\'t in this server!', message.author.username);
        }
    } else {
        displayMessage('Mention a user to Kick!', message.author.username);
    }
};

module.exports.help = {
    description: 'Kicks a Member from Server',
    usage: `${process.env.PREFIX}kick <@mention> <reason for kick>`
};