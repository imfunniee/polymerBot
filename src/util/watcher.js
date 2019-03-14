const chokidar = require('chokidar');
const loadCommand = require('./commandInit');
const loadEvent = require('./eventInit');

module.exports.init = (client, ENV) => {
	if (ENV === 'DEV') {
		const fileWatcher = chokidar.watch(['commands', 'events'], {
			// eslint-disable-next-line no-useless-escape
			ignored: /(^|[\/\\])\../,
			persistent: true,
			ignoreInitial: true
		});

		fileWatcher
			.on('add', (path) => {

				let pathSplit = path.split('\\');

				if (pathSplit[0] === 'commands') {
					loadCommand(client, path, pathSplit);
				}

				if (pathSplit[0] === 'events') {
					loadEvent(client, path, pathSplit);
				}
			});
	}
};