module.exports.run = (client, message, args) => {
    var colorsHex = client.colors;
    const Discord = require('discord.js');

    function displayMessage(text, user) {
        var embed = new Discord.RichEmbed()
            .setTitle(text)
            .setColor(colorsHex[Math.floor(Math.random() * colorsHex.length)])
            .setFooter('exectued by ' + user);
        message.channel.send(embed);
        return embed;
    }

    if (!args[0]) {
        displayMessage('provide a text as argument', message.author.username);
        return;
    }
    var embed = new Discord.RichEmbed()
        .setTitle('Answer for your Query')
        .setURL('https://lmgtfy.com/?q=' + args[0].replace(/\s/g, '+'))
        .setColor(colorsHex[Math.floor(Math.random() * colorsHex.length)])
        .setFooter('executed by ' + message.author.username);
    message.channel.send(embed);
};

module.exports.help = {
    description: 'Creates a LMGTFY URL for dumb folks',
    usage: `${process.env.PREFIX}lmgtfy <text>`
};