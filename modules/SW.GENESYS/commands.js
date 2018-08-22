const functions = require('./');

async function commands(bot, message, params, command, desc, channelEmoji, prefix) {
	switch (command) {
		//Character Tracker
		case 'char':
			functions.char(bot, message, params, channelEmoji);
			break;
		// help module
		case 'help':
			functions.help(bot, message, params[0], prefix);
			break;
		case 'gleepglop':
		case 'species':
			functions.gleepglop(bot, message, params);
			break;
		case 'crit':
			functions.crit(bot, message, params, channelEmoji);
			break;
		//!shipcrit command
		case 'shipcrit':
			functions.shipcrit(bot, message, params, channelEmoji);
			break;
		//Destiny Point Module
		case 'destiny':
		case 'd':
		case 'story':
		case 's':
			functions.destiny(bot, message, params, channelEmoji);
			break;
		// Roll the dice command
		case 'roll':
		case 'r':
			await functions.roll(bot, message, params, channelEmoji, desc).roll;
			break;
		case 'reroll':
		case 'rr':
			functions.reroll(bot, message, params, channelEmoji);
			break;
		case 'initiative':
		case 'init':
		case 'i':
			functions.initiative(bot, message, params, channelEmoji);
			break;
		case 'obligation':
		case 'o':
			functions.trigger(bot, message, 'obligation');
			break;
		case 'duty':
			functions.trigger(bot, message, 'duty');
			break;
	}
}

exports.commands = commands;
