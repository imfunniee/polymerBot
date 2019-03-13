module.exports.run = (message) => {
	var colorsHex = ["#A15CFD","#FD5C68","#FD5CB8","#FDA15C","#FDF15C","#78F35A","#5A78F3"];
    const Discord = require("discord.js");
    
    function displayMessage(text,user){
        var embed = new Discord.RichEmbed()
            .setTitle(text)
            .setColor(colorsHex[Math.floor(Math.random() * colorsHex.length)])
            .setFooter("exectued by " + user);
            message.channel.send(embed);
        return embed;
    }

	let member = message.mentions.members.first();
    if(member){
    if(!message.member.roles.find(roleFind => roleFind.name === "moderator") || !message.member.roles.find(roleFind => roleFind.name === "server-manager")){
        displayMessage("You need a Moderator or above Roles to use this command",message.author.username);
        return;
    }
    const banMember = message.guild.member(member);
    var banText = message.content.substring(process.env.PREFIX.length).slice("4");
    banText = banText.split(' ');
    if(!banText[1]){
        banText = "they were bad :p";
    }else{
        banText = banText[1];
    }
        if(member){
            banMember.ban({
            reason: banText,
        }).then(() => {
            message.reply(`Successfully Banned ${banMember.tag}`,message.author.username);
        }).catch(err => {
            displayMessage('Unable to Ban the Member',message.author.username);
        });
        }else{
            displayMessage('The user isn\'t in this server!',message.author.username);
        }
    }else{
        displayMessage('Mention a user to ban!',message.author.username);
    }
}

module.exports.help = {
	description: "Bans a Member from Server",
	usage: `${process.env.PREFIX}ban <@mention> <reason for ban>`
}