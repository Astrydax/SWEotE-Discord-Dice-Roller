const functions = require('./');
const config = require('../config').config;
const _ = require('lodash');
const seedrandom = require('seedrandom');
const rng = seedrandom('added entropy.', {entropy: true});

const dice = sides => Math.floor(rng() * sides) + 1;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function polyhedral(sides, str, message) {
	let total = 0, r = 0, text = '', modifier;
	if (str.length > 0) modifier = +(str[str.length - 1]).replace(/\D/g, "");
	//no modifier
	if (str.length < 1) {
		total = dice(sides);
		text = ` rolled a d${sides}: ${total}`;
		//addition modifier
	} else if (str.some(e => e.includes('+'))) {
		r = dice(sides);
		total = r + modifier;
		text = ` rolled a d${sides}: ${r} + ${modifier} for at total of ${total}`;
		//subtraction modifier
	} else if (str.some(e => e.includes('-'))) {
		r = dice(sides);
		total = r - modifier;
		text = ` rolled a d${sides}: ${r} - ${modifier} for at total of ${total}`;
	}
	message.reply(text);
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
	if (!params[0]) return [false, params];
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

function buildStats(bot, message) {
	let servers, users = [], i = 0;
	servers = bot.guilds.size;
	bot.guilds.forEach(guild => {
		guild.fetchMembers()
			.then(guild => {
				guild.members.forEach(member => users.push(member.user.id));
				i++;
				if (i >= servers) {
					users = _.uniq(users).length;
					message.channel.send(`Currently on ${servers} servers!\nCurrently assisting ${users} unique users!`).catch(err => console.log(err));
				}
			}).catch(err => console.log(err));
	});
}

function checkPatreon(bot, message) {
	let guild = bot.guilds.get(config.patreonGuild);
	return guild.roles.get(config.patronDiceRole).members.some(member => member.user.id === message.author.id);
}

exports.buildCommand = buildCommand;
exports.buildDescriptor = buildDescriptor;
exports.buildParams = buildParams;
exports.buildPrefix = buildPrefix;
exports.buildStats = buildStats;
exports.checkPatreon = checkPatreon;
exports.dice = dice;
exports.modifierRoll = polyhedral;
exports.sleep = sleep;


