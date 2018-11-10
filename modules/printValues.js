const config = require('../config').config;

function print(str, bot, channelEmoji) {
	return new Promise((resolve, reject) => {
		bot.shard.broadcastEval(`(${findGuild}).call(this, '${config[channelEmoji]}', '${str}')`)
			.then(emojiArray => {
				const foundEmoji = emojiArray.find(emoji => emoji);
				resolve(foundEmoji)
			})
			.catch(reject);
	})
}

function findGuild(guildID, emojiID) {
	const guild = this.guilds.get(guildID);
	if (!guild) return null;
	const emoji = guild.emojis.find(val => val.name === emojiID);
	return emoji.toString();
}

exports.print = print;
