module.exports.run = (client, message, args) => {
	var input = args.join(' ');
	var split = input.split('');

	for (let i = 0; i < split.length; i++) {
		var rand = Math.floor(Math.random() * 2) + 1;
		if (rand == 1) {
			split[i] = split[i].toUpperCase();
		}
	}
	var output = split.join('');
	message.channel.send(output);
};

module.exports.help = {
	description: 'edgy command',
	usage: 'bla bla bla'
};