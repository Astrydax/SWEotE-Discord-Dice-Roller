/*
  Developed by Astrydax, aka Royalcrown28 for vampwood
  For Custom Discord Bots please email me at Astrydax@gmail.com
*/
const functions = require('./modules/');
const swcommands = require('./modules/SW.GENESYS/').commands;
const l5rcommands = require('./modules/L5R/').commands;
const Discord = require('discord.js');
const bot = new Discord.Client();
const firebase = require('firebase');
const _ = require('lodash');

bot.login(functions.config.token).catch(error => console.error(error));
firebase.initializeApp(functions.firebaseconfig);

//Called When bot becomes functional
bot.on('ready', () => {
	console.log(`Bot version ${functions.version}`);
	console.log(`Logged in as ${bot.user.username}!`);
}, error => console.error(error));

//Called whenever a users send a message to the server
bot.on("message", async message => {

	let prefix, params, command, desc, channelEmoji;

	//Ignore messages sent by the bot
	if (message.author.bot) return;

	//build the prefix
	prefix = await functions.buildPrefix(bot, message).catch(error => console.error(error));
	if (!prefix) return;


	//check to see if bot can send messages on channel
	//check to see if external emoji can be used
	if (message.channel.type !== 'dm') {
		if (!message.channel.permissionsFor(bot.user).has('USE_EXTERNAL_EMOJIS')) {
			message.channel.send(`Please enable \'Use External Emoji\' for ${bot.user.username}`).catch(error => console.error(error));
			return;
		}
		if (!message.channel.permissionsFor(bot.user).has('SEND_MESSAGES')) return;
	}
	//build params
	params = functions.buildParams(message, prefix);
	if (!params) return;

	//build command
	[command, params] = functions.buildCommand(params);
	if (!command) return;

	//get channelEmoji
	channelEmoji = await functions.readData(bot, message, 'channelEmoji').catch(error => console.error(error));

	//check for Patron
	if (functions.checkPatreon(bot, message)) channelEmoji += 'Patreon';
	console.log(channelEmoji);
	console.log(functions.checkPatreon(bot, message));


	//make the descriptor
	[desc, params] = functions.buildDescriptor(params);

	//set the rest of params to lowercase
	params = params.filter(Boolean);
	params.forEach((param, index) => params[index] = _.toLower(param));

	console.log(`${message.createdAt} @${message.author.username}\n message: ${message}\n command: ${command}\n params: ${params}`);

//************************COMMANDS START HERE************************

	switch (command) {
		case 'stats':
			functions.buildStats(bot, message);
			break;
		case 'ver':
			message.channel.send(`${bot.user.username}: version: ${functions.version}`).catch(error => console.error(error));
			break;
		case 'poly':
			functions.poly(params, message);
			break;
		case 'swrpg':
		case 'genesys':
		case 'l5r':
			functions.writeData(bot, message, 'channelEmoji', command);
			message.channel.send(`${bot.user.username} will now use ${command} dice`).catch(error => console.error(error));
			break;
		case 'prefix':
			if (message.channel.type === 'dm') message.channel.send('Prefix cannot be changed in DMs').catch(error => console.error(error));
			else functions.prefix(bot, message, params);
			break;
		case 'invite':
			message.channel.send(`Invite @D1-C3  to your server <https://discordapp.com/oauth2/authorize?client_id=294576386696544273&scope=bot&permissions=262144>`).catch(error => console.error(error));
			break;
	}
	if (message.author.id === functions.config.adminID) functions.admin(bot, message, params, command);
	if (channelEmoji.includes('swrpg') || channelEmoji.includes('genesys')) swcommands(bot, message, params, command, desc, channelEmoji, prefix);
	if (channelEmoji.includes('l5r')) l5rcommands(bot, message, params, command, desc, channelEmoji, prefix);
}, error => console.error(error, message));
