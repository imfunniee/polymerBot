const slash = require('slash');
const fs = require('fs');
const nodePath = require('path');

module.exports = (client, path, pathSplit) => {
	const eventInit = fs.readFileSync('./util/boilerplate/event.js');

	let event = pathSplit[1];
	if (!event.endsWith('.js')) return;
	fs.writeFile(`./${path}`, eventInit, () => {
		let eventName = event.split('.')[0];
		let eventPath = slash(nodePath.join('./events', eventName));
		const eventProp = require('../' + eventPath);
		client.on(eventName, (...args) => eventProp.run(client, ...args));
	});
};