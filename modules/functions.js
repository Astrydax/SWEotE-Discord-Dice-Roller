const functions = require('./');
const _ = require('lodash');
const seedrandom = require('seedrandom');
const rng = seedrandom('added entropy.', {entropy: true});

function dice(sides) {
	return Math.floor(rng() * sides) + 1;
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array)
	}
}

function polyhedral(sides, str, message) {
	let total = 0;
	//no modifier
	if (str.length < 1) {
		console.log("No modifier, straight d100 roll");
		let r = dice(sides);
		total = +r;
		message.reply(" rolled a d" + sides + ": " + total);
		//addition modifier
	} else if (str.includes("+") || str[0][0] === "+") {
		console.log("+ modifier detected");
		let modifier = (str[str.length - 1]).replace(/\D/g, "");
		let r = dice(sides);
		total = +r + +modifier;
		message.reply(" rolled a d" + sides + ": " + r + " + " + modifier + " " + "for a total of " + total);
		//subtraction modifier
	} else if (str.includes("-") || str[0][0] === "-") {
		console.log("- modifier detected");
		let modifier = (str[str.length - 1]).replace(/\D/g, "");
		let r = dice(sides);
		total = +r - +modifier;
		message.reply(" rolled a d" + sides + ": " + r + " - " + modifier + " " + "for a total of " + total);
	}
	return total;
}

async function buildPrefix(bot, message) {
	return new Promise(async resolve => {
		let prefix = await functions.readData(bot, message, 'prefix');
		if (!prefix) prefix = functions.config.prefix;

		if (message.content.includes(bot.user.id) && message.content.includes('prefix')) message.channel.send(`${bot.user.username} is using ${prefix} as the activator for this server`);
		//Ignore messages that dont include with the command symbol
		if (!message.content.includes(prefix)) resolve();
		resolve(prefix);
	}).catch(error => message.reply(`That's an Error! ${error} in buildPrefix`));
}

function buildParams(message, prefix) {
	let params = message.content.split(' ');
	if (!params[0].startsWith(prefix)) {
		let newParams = false;
		params.forEach((param, index) => {
			if (param.startsWith(prefix)) newParams = params.slice(index);
		});
		if (!newParams) return;
		params = newParams;
	}
	//remove user mentions
	params.forEach((param, index) => {
		if (param.includes('<') && param.includes('>')) params.splice(index, 1);
	});

	return params;
}

function buildCommand(params) {
	//create command
	let command = params[0].slice(1);
	params = params.slice(1);
	return [_.toLower(command), params];
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

function buildStats(bot) {
	let servers, users = [];
	servers = bot.guilds.size;
	bot.guilds.forEach(guild => {
		guild.members.forEach(member => {
			users.push(member.id)
		})
	});
	users = _.uniq(users);
	return [servers, users.length];
}

exports.buildPrefix = buildPrefix;
exports.buildParams = buildParams;
exports.buildCommand = buildCommand;
exports.buildStats = buildStats;
exports.buildDescriptor = buildDescriptor;
exports.dice = dice;
exports.modifierRoll = polyhedral;
exports.asyncForEach = asyncForEach;


