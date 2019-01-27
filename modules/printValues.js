const config = require('../config').config;
const emoji = require('../emoji.json');

const print = (str, bot, channelEmoji) => {
	return new Promise(resolve => {
		bot.shard.broadcastEval(`(${findGuild}).call(this, '${config[channelEmoji]}', '${str}')`)
			.then(emojiArray => resolve(emojiArray.find(emoji => emoji)))
			.catch(console.error);
	});
};

const findGuild = (guildID, emojiID) => {
	const guild = this.guilds.get(guildID);
	if (!guild) return emojiID;
	const emoji = guild.emojis.find(val => val.name === emojiID);
	return emoji ? emoji.toString() : emojiID;
};

const emojiSearch = (string, type = 'swrpg') => emoji[type][string];

exports.emoji = emojiSearch;
exports.print = print;
