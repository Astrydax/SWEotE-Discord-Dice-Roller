const functions = require('./index');

function prefix(bot, message, params) {
	let botRole = message.guild.roles.find(val => val.name === bot.user.username);
	let userRoles = message.member.roles;
	if (botRole) {
		if (!userRoles.some(role => role.comparePositionTo(botRole) > 0)) {
			message.channel.send(`${message.author.username} does not have a role high enough to change prefix`);
			return;
		}
	}
	if (!params[0]) {
		message.channel.send(`Please include a single symbol prefix ie \`!prefix $\``);
		return;
	}
	functions.writeData(bot, message, 'prefix', params[0][0]);
	message.channel.send(`${bot.user.username} will now use ${params[0][0]} as the activator for this server`);
}

exports.prefix = prefix;