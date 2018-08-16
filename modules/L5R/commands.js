const functions = require('./');

async function commands(bot, message, params, command, desc, channelEmoji) {
	switch (command) {
		case 'roll':
		case 'r':
			functions.roll(params, message, bot, desc, channelEmoji);
			break;
		case 'keep':
		case 'k':
			functions.keep(params, message, bot, desc, channelEmoji);
			break;
		case 'add':
			functions.roll(params, message, bot, desc, channelEmoji, 'add');
			break;
		case 'reroll':
		case 'rr':
			functions.keep(params, message, bot, desc, channelEmoji, 'reroll');
			break;
		case 'help':
		case 'h':
			functions.help(params, message);
			break;
		default:
			break;
	}
}

exports.commands = commands;
