const functions = require('./');

async function buildPrefix(bot, message) {
	return new Promise(async resolve => {
		//Ignore messages sent by the bot
		let prefix = await functions.readData(bot, message, 'prefix');
		if (!prefix) prefix = functions.config.prefix;
		if (message.content.includes(bot.user.id) && message.content.includes('prefix')) message.channel.send(`${bot.user.username} is using ${prefix} as the activator for this server`);
		//Ignore messages that dont include with the command symbol
		if (!message.content.includes(prefix)) resolve();
		resolve(prefix);
	}).catch(error => message.reply(`That's an Error! ${error}`));
}

function buildParams(message, prefix) {
	let params = message.content.split(' ');
	if (!message.content.startsWith(prefix)) {
		params.forEach((param, index) => {
			if (param.startsWith(prefix)) params = params.slice(index);
		});
	}

	//remove user mentions
	params.forEach((param, index) => {
		if (param.includes('<') && param.includes('>')) params.splice(index, 1);
	});
	return params;
}

function buildCommand(message, params) {
	//create command
	let command = params[0].toLowerCase().toString().slice(1);
	params = params.slice(1);
	let sides;
	if (command.startsWith('d') && (command.length > 1) && (command !== 'destiny')) {
		sides = command.replace(/\D/g, '');
		command = 'polyhedral';
		if (!sides) return;
	}
	return [command, params, sides];
}

function buildDescriptor(params) {
	let beg, end;
	let desc = [];
	params.forEach((param, index) => {
		if (param.includes('\"') || param.includes('“') | param.includes('\'')) {
			if (beg === undefined) {
				beg = index;
				end = index;
			} else end = index;
		}
	});

	if (beg !== undefined && end !== undefined) {
		desc = params.slice(beg, end + 1);
		params.splice(beg, end + 1 - beg);
		desc.forEach((word, index) => desc[index] = word.replace(/['"`“]/g, ''));
		desc = desc.join(' ');
	}
	return [desc, params];
}

exports.buildPrefix = buildPrefix;
exports.buildParams = buildParams;
exports.buildCommand = buildCommand;
exports.buildDescriptor = buildDescriptor;
