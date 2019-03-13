module.exports.run = (client, message) => {
	message.channel.send("test")
}

module.exports.help = {
	description: "Boilerplate command",
	usage: "{prefix}command"
}