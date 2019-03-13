module.exports.run = (client, message) => {
	message.channel.send("teastss")
}

module.exports.help = {
	description: "Displays userinfo",
	usage: `${process.env.PREFIX}info < @mention >`
}