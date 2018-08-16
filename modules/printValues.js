const config = require('../config').config;

function print(str, bot, channelEmoji) {
	let guild = bot.guilds.get(config[channelEmoji]);
	return guild.emojis.find(val => val.name === str).toString();
}

exports.print = print;
